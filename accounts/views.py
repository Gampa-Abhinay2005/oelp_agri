from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser, Question, Answer
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    QuestionSerializer,
    AnswerSerializer,
)

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data["username"],
                password=serializer.validated_data["password"],
            )
            if user:
                refresh = RefreshToken.for_user(user)
                return Response(
                    {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                        "role": user.role,
                    }
                )
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by("-created_at")
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data["user"] = request.user.id  # ✅ Auto-assign logged-in user
        serializer = self.get_serializer(data=data)

        if serializer.is_valid():
            serializer.save(user=request.user)  # ✅ Save user automatically
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AnswerViewSet(viewsets.ModelViewSet):
    serializer_class = AnswerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Answer.objects.filter(question_id=self.kwargs["question_pk"])

    def create(self, request, question_pk=None):
        if request.user.role != "expert":
            return Response({"error": "Only experts can answer"}, status=status.HTTP_403_FORBIDDEN)

        try:
            question = Question.objects.get(pk=question_pk)
        except Question.DoesNotExist:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        # Only validate the body field from the request
        serializer = self.get_serializer(data={"body": request.data.get("body")})
        serializer.is_valid(raise_exception=True)

        # Pass expert and question manually into save()
        serializer.save(expert=request.user, question=question)

        return Response(serializer.data, status=status.HTTP_201_CREATED)



from django.http import JsonResponse
from rest_framework.decorators import api_view
from ml_model.a import predict_fertilizer_and_crop,predict_yield

@api_view(['POST'])
def crop_recommendation(request):
    try:
        print("Incoming data:", request.data)
        data = request.data
        temp = data.get('temp')
        potassium = data.get('potassium')
        phosphorus = data.get('phosphorus')
        nitrogen = data.get('nitrogen')
        humidity = data.get('humidity')
        moisture = data.get('moisture')
        soil_type = data.get('soil_type')

        # Validate inputs
        # for key, value in data.items():
            # print(f"{key} = {value} (type: {type(value)})")

        try:
            recommended_crop = predict_fertilizer_and_crop(
                temp, potassium, phosphorus, nitrogen, humidity, moisture, soil_type
            )
        except Exception as inner_e:
            print("Error inside prediction function:", inner_e)
            return JsonResponse({'error': f'Prediction error: {str(inner_e)}'}, status=400)
        # print("Recommended crop:", recommended_crop)
        return JsonResponse({'recommended_crop': recommended_crop['Predicted Crop Name'],
                            'recommended_fertilizer': recommended_crop['Predicted Fertilizer Name']})
    except Exception as e:
        print("Outer exception:", e)
        return JsonResponse({'error': str(e)}, status=400)


@api_view(['POST'])
def yield_pre(request):
    try:
        data = request.data
        crop = data.get('crop')
        state = data.get('state')
        district = data.get('district')
        area = data.get('area')
        season = data.get('season')
        
        predicted_yield = predict_yield(crop, state, district, area, season)
        # print(predicted_yield)
        return JsonResponse({'predicted_yield': predicted_yield})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


# chat_bot
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import ollama  # Use Ollama's local model

# Function to generate a response from Ollama's Llama3 model
def generate_response(user_input):
    try:
        response = ollama.chat(
            model='mistral',
            messages=[
                {"role": "user", "content": user_input}
            ],
        )
        return response.get("message", {}).get("content", "No response from model.")
    except Exception as e:
        return f"Error: {str(e)}"

@csrf_exempt
def chatbot_response(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_input = data.get("message", "")
        
        answer = generate_response(user_input)
        # print(answer)
        return JsonResponse({"response": answer})

