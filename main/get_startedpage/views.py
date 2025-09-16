from django.shortcuts import render

def get_started(request):
    return render(request, 'get_startedpage/get_started.html')