from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser, Question, Answer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "role"]

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["username", "email", "password", "role"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data.get("role", "user"),
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)




class AnswerSerializer(serializers.ModelSerializer):
    expert = UserSerializer(read_only=True)

    class Meta:
        model = Answer
        fields = ["id", "body", "created_at", "expert", "question"]
        extra_kwargs = {
            "question": {"read_only": True},
        }
class QuestionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # ✅ Include user details
    answers = AnswerSerializer(source="answer_set", many=True, read_only=True)
    class Meta:
        model = Question
        fields = ["id", "title", "body", "created_at", "user","answers"]