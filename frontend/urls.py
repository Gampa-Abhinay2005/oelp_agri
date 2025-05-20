from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from accounts.views import QuestionViewSet, AnswerViewSet,crop_recommendation,yield_pre
from accounts.views import chatbot_response
answer_list = AnswerViewSet.as_view({
    'get': 'list',
    'post': 'create',
})
router = DefaultRouter()
router.register(r'questions', QuestionViewSet)
router.register(r'answers', AnswerViewSet, basename="answers")

urlpatterns = [
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include(router.urls)),
    path("api/questions/", QuestionViewSet.as_view({'post': 'create'}), name="question_create"),
    path("questions/<int:question_pk>/answers/", answer_list, name="question-answers"),
    path("crop-recommendation/", crop_recommendation, name="crop_recommendation"),
    path("predict-yield/", yield_pre, name="predict_yield"),
    path('chat/', chatbot_response, name='chatbot_response'),
]
