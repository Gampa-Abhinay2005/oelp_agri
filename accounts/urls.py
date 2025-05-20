from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, QuestionViewSet, AnswerViewSet, RegisterView, LoginView, chatbot_response,crop_recommendation,yield_pre

answer_list = AnswerViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

router = DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"questions", QuestionViewSet, basename="question")


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("api/", include(router.urls)),  # auto routes for /users/ and /questions/
    path("crop-recommendation/", crop_recommendation, name="crop_recommendation"),
    path("predict-yield/", yield_pre, name="predict_yield"),
    
    path("api/questions/<int:question_pk>/answers/", answer_list, name="question-answers"),

    path("api/chat/", chatbot_response, name="chatbot_response")
]
