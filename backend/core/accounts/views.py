from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions ,authentication
from rest_framework import status
from django.contrib.auth.models import User

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, NotesSerializer

from .models import Notes
# Create your views here.


class Register(APIView):
    
    def post(self,request):
        data = request.data
        serializer = RegisterSerializer(data = data)

        if serializer.is_valid():

            user = serializer.save()
            return Response({
                "message" : "User created successfully",
                "data" : serializer.data
                
            },status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class Login(APIView):
    def post(self, request):
        data = request.data
        username = data.get('username')
        password = data.get('password')
        
        print('pass',password)
        user = User.objects.filter(username=username).first()
        print("user", user)
        print(user.check_password(password))
        if user and user.check_password(password):

            refresh = RefreshToken.for_user(user)
            return Response({
                "access_token" : str(refresh.access_token),
                "refresh_token" : str(refresh)
            },status=status.HTTP_200_OK)
        
        return Response({
            "message": "Invalid credentials"
        }, status=status.HTTP_400_BAD_REQUEST)
    



class NotesListCreate(generics.ListCreateAPIView):
    serializer_class = NotesSerializer
    permission_classes = [permissions.IsAuthenticated]
  
    def get_queryset(self):
        user = self.request.user
        print("user", user)
        return Notes.objects.filter(author = user)
    
    def perform_create(self, serializer):
        user = self.request.user

        if serializer.is_valid():
            serializer.save(author=user)
            return serializer.data
        

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NotesSerializer
    permission_classes = [permissions.IsAuthenticated]    

    def destroy(self, request, *args, **kwargs):
        user = request.user
        note_id = kwargs.get('id')  # Retrieve the 'id' from the URL
        try:
            userNotes = user.notes_set.get(id=note_id)  # Fetch the note by id
            userNotes.delete()  # Delete the note
            return Response({"message": "Note deleted successfully"}, status=status.HTTP_200_OK)
        except user.notes_set.model.DoesNotExist:
            return Response({"message": "Note not found"}, status=status.HTTP_404_NOT_FOUND)
        
       
        
