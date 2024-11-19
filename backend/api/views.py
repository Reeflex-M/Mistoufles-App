from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from .serializers import UserSerializer, AnimalSerializer, FASerializer, UserSerializer, StatutSerializer, ProvenanceSerializer, SexeSerializer, CategorieSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from .models import Animal, FA, Statut, Provenance, Sexe, Categorie

#ANIMAL
class AnimalListCreate(generics.ListCreateAPIView):
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated]
    queryset = Animal.objects.all()
    
    #Return all animal
    def get_queryset(self):
        queryset = Animal.objects.select_related('statut', 'fa').all()
        return queryset.prefetch_related('provenance', 'categorie', 'sexe')
    
    def create(self, request, *args, **kwargs):
        print("Données reçues:", request.data)  # Debug
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            animal = serializer.save()
            # Récupérer l'animal avec toutes ses relations
            updated_serializer = self.get_serializer(animal)
            return Response(updated_serializer.data, status=status.HTTP_201_CREATED)
        print("Erreurs de validation:", serializer.errors)  # Debug
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save()

class AnimalDelete(generics.DestroyAPIView):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated]

#animal update
class AnimalUpdate(generics.UpdateAPIView):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'  #utilise id animal comme parametre de recherche

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        print("Données reçues pour mise à jour:", request.data)

        # Mise à jour des champs simples
        editable_fields = [
            'nom_animal', 'date_naissance', 'num_identification',
            'primo_vacc', 'rappel_vacc', 'vermifuge', 'antipuce',
            'sterilise', 'biberonnage'
        ]

        for field in editable_fields:
            if field in request.data:
                setattr(instance, field, request.data[field])

        # Mise à jour du statut si présent
        if 'statut' in request.data:
            try:
                statut = Statut.objects.get(id_statut=request.data['statut'])
                if statut.libelle_statut.lower() == "adopté":
                    instance.delete()
                    return Response({
                        "message": "Animal supprimé car adopté"
                    }, status=status.HTTP_200_OK)
                
                instance.statut = statut
                
            except Statut.DoesNotExist:
                return Response({"error": "Statut non trouvé"}, status=400)

        instance.save()
        serializer = AnimalSerializer(instance)
        return Response(serializer.data)

class AnimalArchiveList(generics.ListAPIView):
    serializer_class = AnimalSerializer
    
    def get_queryset(self):
        return Animal.objects.filter(archive=True)




#FA
class FAListCreate(generics.ListCreateAPIView):
    serializer_class = FASerializer
    permission_classes = [IsAuthenticated]
    
    #Return all fa
    def get_queryset(self):
        return FA.objects.all()
    
    # Correction du nom de la méthode
    def perform_create(self, serializer):  # Changé de perform_create_fa à perform_create
        serializer.save()  

class FAUpdate(generics.UpdateAPIView):
    queryset = FA.objects.all()
    serializer_class = FASerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        print("Données reçues pour mise à jour FA:", request.data)  # Debug

        # Mise à jour spécifique pour la note
        if 'note' in request.data:
            instance.note = request.data['note']
            instance.save()
            print("Note mise à jour:", instance.note)  # Debug
            return Response({'note': instance.note})

        # Pour les autres champs
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FADetail(generics.RetrieveAPIView):
    queryset = FA.objects.all()
    serializer_class = FASerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'  #utilise id fa comme parametre de recherche





# Statut
class StatutList(generics.ListAPIView):
    queryset = Statut.objects.all()
    serializer_class = StatutSerializer
    permission_classes = [IsAuthenticated]

# Provenance
class ProvenanceList(generics.ListAPIView):
    queryset = Provenance.objects.all()
    serializer_class = ProvenanceSerializer
    permission_classes = [IsAuthenticated]

# Sexe
class SexeList(generics.ListAPIView):
    queryset = Sexe.objects.all()
    serializer_class = SexeSerializer
    permission_classes = [IsAuthenticated]

# Catégorie
class CategorieList(generics.ListAPIView):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [IsAuthenticated]






#USER
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

# Supprimez la classe HistoriqueList