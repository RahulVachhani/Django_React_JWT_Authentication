from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


     path('register/', views.Register.as_view(), name='register' ),
     path('login/', views.Login.as_view(), name='login'),


     path('notes/',  views.NotesListCreate.as_view(), name='notes_list'),
     path('notes/<str:id>/', views.NoteDelete.as_view(), name = 'note_delete')
]
