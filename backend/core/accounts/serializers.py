
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Notes

class RegisterSerializer(serializers.ModelSerializer):
    # password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username','password']
        extra_kwargs = {"password" : {"write_only":True}}     # this is for not sending password field when its send data


    def validate(self, data):
        if User.objects.filter(username = data['username']).exists():
            raise serializers.ValidationError("Username already taken")
        
        # if data['password'] != data['password2']:
        #     raise serializers.ValidationError("Password must be same")
        
        return data
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password= validated_data['password']
        )
       
        return user

        
class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notes
        fields = "__all__"
        extra_kwargs = {"author" : {"read_only":True}}   # if we write read_only then we can not add from frontend
