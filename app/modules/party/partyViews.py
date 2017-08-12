from django.shortcuts import render
from app.modules.party.partyModels import *
from django.http import HttpRequest,JsonResponse
from django.db.models import Q

import sys

from app.helper import *

def getAllPerson(request):
  _from = int(request.GET['_from'])
  _to = int(request.GET['_to'])
  _orders = []
  try:
    _orders = request.GET.getlist('orders[]')
  except: 
    print(sys.exc_info())

  qs = list(Person.objects.all().order_by(*_orders)[ _from : _to ].values())

  return JsonResponse( { 'message' : 'success', 'qs' : qs }, safe = False )














def getPersonInfo(request, person_id):
  data = Person.objects.filter(id = person_id).values()[:1]
  return JsonResponse( { 'message' : 'success', 'person_info' : data }, safe = False )

def getAllPersonCount(request):
  data = Person.objects.all().count()

  return JsonResponse( { 'message' : 'success', 'count' : data }, safe = False )

def searchOnParty(request):
  value = request.GET['search_for']
  _from = int(request.GET['_from'])
  _to = int(request.GET['_to'])
  _columns = []
  _orders = []
  try: 
    _columns = request.GET.getlist('columns[]')
  except:
    print(sys.exc_info())
  try:
    _orders = request.GET.getlist('orders[]')
  except:
    print(sys.exc_info())
  q_obj = Q()
  for item in _columns:
    obj = {}
    strCol = item+'__'+'icontains'
    obj[strCol] = value
    q_obj.add(Q(**obj), Q.OR)
    
  count = Person.objects.filter(q_obj).count()
  qs = Person.objects.filter( q_obj ).order_by(*_orders)[_from:_to]
  print(qs.query)
  data = list( qs.values() )
  return JsonResponse( { 'message' : 'success', 'qs' : data, 'counted' : count }, safe = False )




def deleteSelected(request):
  obj = getJSONObj(request)
  _ids = obj['ids']
  print(_ids)
  return JsonResponse( { 'message' : 'success' }, safe = False )


def getInfo(request):
  id = request.GET['id']
  data = Person.objects.filter(id = id).values()[0]
  return JsonResponse( { 'message' : 'success', 'qs' : data }, safe = False )


def saveNewInfo(request):
  obj = getJSONObj(request)
  new_data = obj['new_data']
  id = obj['id']
  msg = ''
  try:
    Person.objects.filter(id = id).update(**new_data)
    msg = 'success'
  except:
    msg = 'failed'
    print(sys.exc_info())
  return JsonResponse({ 'message' : msg }, safe = False )

def addAndEditFields( request ):
  data = [
    { 'type' : 'text', 'label' : 'First name' },
    { 
      'type' : 'choice', 
      'choices' : [ 
        { 'label' : 'label one', 'value' : '2' },
        { 'label' : 'label two', 'value' : '1' }
      ],
      'label' : 'First name' 
    },
  ]
  return JsonResponse({'message' : 'success', 'qs' : data }, safe = False)

def saveNewEntry(request):
  obj = getJSONObj(request)
  new_entry = obj['new_entry']
  
  first_name = new_entry['first_name']
  last_name = new_entry['last_name']
  middle_name = new_entry['middle_name']
  suffix = new_entry['suffix']
  status_id = new_entry['status_id']

  new_data = Person( first_name = first_name, \
    last_name = last_name, \
    middle_name = middle_name, \
    suffix = suffix, \
    status_id = status_id )
  new_data.save()

  return JsonResponse( { 'message' : 'success' }, safe = False )

def getPersonStatuses( request ):
  val = request.GET['value']
  lmt = int(request.GET['limit'])
  data = list( Status.objects.filter( description__icontains = val )[:lmt].values() )

  return JsonResponse( { 'message' : 'success', 'qs' : data }, safe = False )

def getPersonStatus( request ):
  con = {}
  key = request.GET['key']
  val = request.GET['value']
  con[key] = val  
  data = list( Status.objects.filter( **con )[:1].values())
  return JsonResponse( {'message' : 'success', 'qs' : data }, safe = False )













 # count = Person.objects.filter( \
  #   Q( first_name__icontains = value) | \
  #   Q( last_name__icontains = value ) | \
  #   Q(middle_name__icontains = value) | \
  #   Q( suffix__icontains = value ) ).count()
  
  # data = list( Person.objects.filter( \
  #   Q( first_name__icontains = value) | \
  #   Q( last_name__icontains = value ) | \
  #   Q(middle_name__icontains = value) | \
  #   Q( suffix__icontains = value ) )[_from:_to].values() )
  


  # Person(f_name = 'Nylah', l_name = 'Holmes', m_name = 'S.', suffix='').save()
  # Person(f_name = 'Luca', l_name = 'Gates', m_name = 'f.', suffix='').save()
  # Person(f_name = 'Gillian', l_name = 'Ware', m_name = 't.', suffix='').save()
  # Person(f_name = 'Braelyn', l_name = 'Pham', m_name = 'p.', suffix='').save()
  # Person(f_name = 'Atticus', l_name = 'Curry', m_name = 'l.', suffix='').save()
  # Person(f_name = 'Laney', l_name = 'Fuller', m_name = 'w.', suffix='').save()
  # Person(f_name = 'Desmond', l_name = 'Walter', m_name = 'r.', suffix='').save()
  # Person(f_name = 'Carolina', l_name = 'Scott', m_name = 'a.', suffix='').save()
  # Person(f_name = 'Lyla', l_name = 'Vaughan', m_name = 'q.', suffix='').save()
  # Person(f_name = 'Chris', l_name = 'Alvarez', m_name = 'o.', suffix='').save()
  
  # Person(f_name = 'Destinee', l_name = 'Armstrong', m_name = 'p.', suffix='').save()
  # Person(f_name = 'Ansley', l_name = 'Armstrong', m_name = 'p.', suffix='').save()
  # Person(f_name = 'Thaddeus', l_name = 'Sawyer', m_name = 'p.', suffix='').save()
  # Person(f_name = 'Jaylin', l_name = 'Kelly', m_name = 'w.', suffix='').save()
  # Person(f_name = 'Aisha', l_name = 'Walsh', m_name = 'e.', suffix='').save()
  # Person(f_name = 'Kylie', l_name = 'Padilla', m_name = 'q.', suffix='').save()
  # Person(f_name = 'Jayleen', l_name = 'Ayala', m_name = 't.', suffix='').save()
  # Person(f_name = 'Evelin', l_name = 'Monroe', m_name = 't.', suffix='').save()
  # Person(f_name = 'Cael', l_name = 'Warner', m_name = 'o.', suffix='').save()
  # Person(f_name = 'Kyler', l_name = 'Chambers', m_name = 'y.', suffix='').save()

  # Person(f_name = 'Julianne', l_name = 'Hayden', m_name = 'u.', suffix='').save()
  # Person(f_name = 'Gage', l_name = 'Gibbs', m_name = 'u.', suffix='').save()
  # Person(f_name = 'Leonard', l_name = 'Bates', m_name = 'u.', suffix='').save()
  # Person(f_name = 'Kiera', l_name = 'Todd', m_name = 'i.', suffix='').save()
  # Person(f_name = 'Nina', l_name = 'Glenn', m_name = 'r.', suffix='').save()
  # Person(f_name = 'Elle', l_name = 'Acevedo', m_name = 'd.', suffix='').save()
  # Person(f_name = 'Teagan', l_name = 'Hopkins', m_name = 'a.', suffix='').save()
  # Person(f_name = 'Allen', l_name = 'Villarreal', m_name = 's.', suffix='').save()
  # Person(f_name = 'Melvin', l_name = 'Estes', m_name = 'k.', suffix='').save()
  # Person(f_name = 'Beckett', l_name = 'Gregory', m_name = 'l.', suffix='').save()

  # Person(f_name = 'Rayan', l_name = 'May', m_name = 'g.', suffix='').save()
  # Person(f_name = 'Shea', l_name = 'Copeland', m_name = 'i.', suffix='').save()
  # Person(f_name = 'Karley', l_name = 'Herring', m_name = 'c.', suffix='').save()
  # Person(f_name = 'Alexus', l_name = 'Beck', m_name = 'v.', suffix='').save()
  # Person(f_name = 'Augustus', l_name = 'Brewer', m_name = 'b.', suffix='').save()
  # Person(f_name = 'Shiloh', l_name = 'Mcdaniel', m_name = 'n.', suffix='').save()
  # Person(f_name = 'Parker', l_name = 'Livingston', m_name = 'm.', suffix='').save()
  # Person(f_name = 'Kaley', l_name = 'Pace', m_name = 'n.', suffix='').save()
  # Person(f_name = 'Cindy', l_name = 'Steele', m_name = 'p.', suffix='').save()
  # Person(f_name = 'Kennedi', l_name = 'Ingram', m_name = 'j.', suffix='').save()

  # Person(f_name = 'pia', l_name = 'caudill', m_name = 'e.', suffix='').save()
  # Person(f_name = 'belle', l_name = 'negron', m_name = 'r.', suffix='').save()
  # Person(f_name = 'Marvis', l_name = 'sipes', m_name = 'h.', suffix='').save()
  # Person(f_name = 'Lorina', l_name = 'dietrich', m_name = 'p.', suffix='').save()
  # Person(f_name = 'Antone', l_name = 'bergstrom', m_name = 'l.', suffix='').save()
  # Person(f_name = 'Charisse', l_name = 'kyle', m_name = 'r.', suffix='').save()
  # Person(f_name = 'Sarina', l_name = 'plummer', m_name = 't.', suffix='').save()
  # Person(f_name = 'Charline', l_name = 'wester', m_name = 'h.', suffix='').save()
  # Person(f_name = 'Lavone', l_name = 'nabors', m_name = 'g.', suffix='').save()
  # Person(f_name = 'Markus', l_name = 'strain', m_name = 'k.', suffix='').save()

  # Person(f_name = 'Gregory', l_name = 'Crespo', m_name = 'l.', suffix='').save()
  # Person(f_name = 'Celeste', l_name = 'Youngblood', m_name = 'l.', suffix='').save()
  # Person(f_name = 'Nickole', l_name = 'Root', m_name = 'f.', suffix='').save()
  # Person(f_name = 'Vita', l_name = 'Lombardo', m_name = 's.', suffix='').save()
  # Person(f_name = 'Hermila', l_name = 'Nadeau', m_name = 'd.', suffix='').save()
  # Person(f_name = 'Gaylord', l_name = 'Pachero', m_name = 'a.', suffix='').save()
  # Person(f_name = 'Cary', l_name = 'Winter', m_name = 'q.', suffix='').save()
  # Person(f_name = 'Gennie', l_name = 'helton', m_name = 'w.', suffix='').save()
  # Person(f_name = 'Jamaal', l_name = 'benedict', m_name = 'e.', suffix='').save()
  # Person(f_name = 'Rheba', l_name = 'Durr', m_name = 'r.', suffix='').save()

  # Person(f_name = 'James', l_name = 'Solomon', m_name = 'z.', suffix='').save()
  # Person(f_name = 'Page', l_name = 'Amaral', m_name = 'x.', suffix='').save()
  # Person(f_name = 'Thora', l_name = 'Cates', m_name = 'c.', suffix='').save()
  # Person(f_name = 'Felisha', l_name = 'Dowell', m_name = 'v.', suffix='').save()
  # Person(f_name = 'Ilene', l_name = 'Begay', m_name = 'b.', suffix='').save()
  # Person(f_name = 'Josiah', l_name = 'Marchand', m_name = 'n.', suffix='').save()
  # Person(f_name = 'Roxann', l_name = 'Richard', m_name = 'm.', suffix='').save()
  # Person(f_name = 'Leota', l_name = 'Cotter', m_name = 'h.', suffix='').save()
  # Person(f_name = 'Stanford', l_name = 'Kinder', m_name = 'j.', suffix='').save()
  # Person(f_name = 'Janita', l_name = 'Rector', m_name = 'l.', suffix='').save()

  # Person(f_name = 'Clarinda', l_name = 'Caswell', m_name = 'a.', suffix='').save()
  # Person(f_name = 'Katy', l_name = 'Nunn', m_name = 's.', suffix='').save()
  # Person(f_name = 'Tequila', l_name = 'Robinette', m_name = 'd.', suffix='').save()
  # Person(f_name = 'Fidela', l_name = 'Mccloskey', m_name = 'f.', suffix='').save()
  # Person(f_name = 'Vicente', l_name = 'Rousseau', m_name = 'g.', suffix='').save()
  # Person(f_name = 'Jacquelin', l_name = 'Cosby', m_name = 'h.', suffix='').save()
  # Person(f_name = 'Haley', l_name = 'Battle', m_name = 'h.', suffix='').save()
  # Person(f_name = 'Lashaunda', l_name = 'Irwin', m_name = 'e.', suffix='').save()
  # Person(f_name = 'Isadora', l_name = 'Ingram', m_name = 'r.', suffix='').save()
  # Person(f_name = 'Angelique', l_name = 'Ingram', m_name = 't.', suffix='').save()

  # Person(f_name = 'Tessa', l_name = 'Sosa', m_name = 'y.', suffix='').save()
  # Person(f_name = 'Remona', l_name = 'Rowell', m_name = 'u.', suffix='').save()
  # Person(f_name = 'Laronda', l_name = 'Musser', m_name = 'i.', suffix='').save()
  # Person(f_name = 'Dori', l_name = 'Dowdy', m_name = 'o.', suffix='').save()
  # Person(f_name = 'Angella', l_name = 'Alonso', m_name = 'p.', suffix='').save()
  # Person(f_name = 'Leoma', l_name = 'Mattingly', m_name = 'q.', suffix='').save()
  # Person(f_name = 'Beata', l_name = 'Hickman', m_name = 'w.', suffix='').save()
  # Person(f_name = 'August', l_name = 'Newberry', m_name = 's.', suffix='').save()
  # Person(f_name = 'Ok', l_name = 'Bowlin', m_name = 'a.', suffix='').save()
  # Person(f_name = 'Candra', l_name = 'Earls', m_name = 'd.', suffix='').save()

  # Person(f_name = 'LovAne', l_name = 'Earls', m_name = 'w.', suffix='').save()
  # Person(f_name = 'cHaRline', l_name = 'NaboRs', m_name = 'e.', suffix='').save()
  # Person(f_name = 'sArIna', l_name = 'WestEr', m_name = 'q.', suffix='').save()
  # Person(f_name = 'cHaRisse', l_name = 'PlUmmer', m_name = 'r.', suffix='').save()
  # Person(f_name = 'anTone', l_name = 'Kyle', m_name = 't.', suffix='').save()
  # Person(f_name = 'lorina', l_name = 'Bergstrom', m_name = 'y.', suffix='').save()
  # Person(f_name = 'maRvis', l_name = 'Dietrich', m_name = 'u.', suffix='').save()
  # Person(f_name = 'beLle', l_name = 'Sipes', m_name = 'i.', suffix='').save()
  # Person(f_name = 'pIa', l_name = 'Negron', m_name = 'o.', suffix='').save()
  # Person(f_name = 'kaSsandra', l_name = 'Caudill', m_name = 'p.', suffix='').save()
  
  # Person(f_name = 'aniSsa', l_name = 'sHoRe', m_name = 'a.', suffix='').save()
  # Person(f_name = 'ashLyN', l_name = 'sYlvEsteR', m_name = 's.', suffix='').save()
  # Person(f_name = 'ferdInand', l_name = 'rOldan', m_name = 'd.', suffix='').save()
  # Person(f_name = 'claRine', l_name = 'coNger', m_name = 'f.', suffix='').save()
  # Person(f_name = 'trEy', l_name = 'PaulSon', m_name = 'g.', suffix='').save()
  # Person(f_name = 'manDa', l_name = 'KetChum', m_name = 'h.', suffix='').save()
  # Person(f_name = 'mecheLle', l_name = 'SaLEs', m_name = 'j.', suffix='').save()
  # Person(f_name = 'hettie', l_name = 'bEAN', m_name = 'k.', suffix='').save()
  # Person(f_name = 'henrY', l_name = 'DarBy', m_name = 'l.', suffix='').save()
  # Person(f_name = 'leXIe', l_name = 'rEaHan', m_name = 'z.', suffix='').save()
  
  # Person(f_name = 'ZenObia', l_name = 'CARSWELL', m_name = 'w.', suffix='').save()
  # Person(f_name = 'LaTia', l_name = 'BeACH', m_name = 'e.', suffix='').save()
  # Person(f_name = 'Lera', l_name = 'SchaFFer', m_name = 'r.', suffix='').save()
  # Person(f_name = 'MaRis', l_name = 'BaRgEr', m_name = 'g.', suffix='').save()
  # Person(f_name = 'BrItta', l_name = 'MccRaY', m_name = 'b.', suffix='').save()
  # Person(f_name = 'Jetta', l_name = 'ThUrMan', m_name = 'v.', suffix='').save()
  # Person(f_name = 'eOsalyn', l_name = 'BethEa', m_name = 'c.', suffix='').save()
  # Person(f_name = 'SHaRen', l_name = 'behrenS', m_name = 'x.', suffix='').save()
  # Person(f_name = 'LeonIla', l_name = 'masTErSon', m_name = 'z.', suffix='').save()
  # Person(f_name = 'FlOrrIe', l_name = 'hOLLINs', m_name = 'n.', suffix='').save()
  
  # Person(f_name = 'Syreeta', l_name = 'holLiNS', m_name = 'n.', suffix='').save()
  # Person(f_name = 'Kianna', l_name = 'pLatT', m_name = 'm.', suffix='').save()
  # Person(f_name = 'Frankie', l_name = 'DOve', m_name = 'j.', suffix='').save()
  # Person(f_name = 'Stephanie', l_name = 'blodgett', m_name = 'h.', suffix='').save()
  # Person(f_name = 'Troy', l_name = 'Murillo', m_name = 'g.', suffix='').save()
  # Person(f_name = 'Deadra', l_name = 'Bragg', m_name = 'f.', suffix='').save()
  # Person(f_name = 'Glory', l_name = 'Nadeau', m_name = 'd.', suffix='').save()
  # Person(f_name = 'Claude', l_name = 'Rosenberg', m_name = 'p.', suffix='').save()
  # Person(f_name = 'Tammara', l_name = 'Gallagher', m_name = 'o.', suffix='').save()
  # Person(f_name = 'Necole', l_name = 'Turks', m_name = 'r.', suffix='').save()
  
  # Person(f_name = 'RoSaLina', l_name = 'GuiNN', m_name = 'w.', suffix='').save()
  # Person(f_name = 'SUSY', l_name = 'AMaraL', m_name = 'q.', suffix='').save()
  # Person(f_name = 'oLimPIA', l_name = 'HeRRick', m_name = 's.', suffix='').save()
  # Person(f_name = 'MiCHIKO', l_name = 'MeZA', m_name = 't.', suffix='').save()
  # Person(f_name = 'JohnTHON', l_name = 'ReGAN', m_name = 'e.', suffix='').save()
  # Person(f_name = 'EmiLIA', l_name = 'CamPOS', m_name = 'q.', suffix='').save()
  # Person(f_name = 'MaHALIA', l_name = 'GuthRie', m_name = 'p.', suffix='').save()
  # Person(f_name = 'aDELIA', l_name = 'Graf', m_name = 'k.', suffix='').save()
  # Person(f_name = 'SON', l_name = 'BIViNs', m_name = 's.', suffix='').save()
  # Person(f_name = 'MiCHAel', l_name = 'aLdermaN', m_name = 'p.', suffix='').save()
  
  # Person(f_name = 'Shizuko', l_name = 'Morey', m_name = 'w.', suffix='').save()
  # Person(f_name = 'Karie', l_name = 'Meacham', m_name = 'q.', suffix='').save()
  # Person(f_name = 'Lenard', l_name = 'Mcnamara', m_name = 's.', suffix='').save()
  # Person(f_name = 'Shellie', l_name = 'Bethea', m_name = 't.', suffix='').save()
  # Person(f_name = 'Bunny', l_name = 'Dumas', m_name = 'e.', suffix='').save()
  # Person(f_name = 'Willene', l_name = 'Vann', m_name = 'q.', suffix='').save()
  # Person(f_name = 'Willene', l_name = 'Eastman', m_name = 'p.', suffix='').save()
  # Person(f_name = 'Vinita', l_name = 'Eastman', m_name = 'k.', suffix='').save()
  # Person(f_name = 'Dara', l_name = 'Delagarza', m_name = 's.', suffix='').save()
  # Person(f_name = 'Doreatha', l_name = 'Ferreira', m_name = 'p.', suffix='').save()

  # Person(f_name = 'Ester', l_name = 'Bethel', m_name = 'w.', suffix='').save()
  # Person(f_name = 'Lyla', l_name = 'Wilmoth', m_name = 'q.', suffix='').save()
  # Person(f_name = 'Shawnee', l_name = 'Wilmoth', m_name = 's.', suffix='').save()
  # Person(f_name = 'Shad', l_name = 'Keener', m_name = 't.', suffix='').save()
  # Person(f_name = 'Samella', l_name = 'Steiner', m_name = 'e.', suffix='').save()
  # Person(f_name = 'Nam', l_name = 'Binkley', m_name = 'q.', suffix='').save()
  # Person(f_name = 'Jen', l_name = 'Ocampo', m_name = 'p.', suffix='').save()
  # Person(f_name = 'Pauletta', l_name = 'Mccorkle', m_name = 'k.', suffix='').save()
  # Person(f_name = 'Teresia', l_name = 'Bergstrom', m_name = 's.', suffix='').save()
  # Person(f_name = 'Antionette', l_name = 'Christy', m_name = 'p.', suffix='').save()

  # Person(f_name = 'Jannie', l_name = 'Durr', m_name = 'w.', suffix='').save()
  # Person(f_name = 'Latosha', l_name = 'Morin', m_name = 'q.', suffix='').save()
  # Person(f_name = 'Travis', l_name = 'Berman', m_name = 's.', suffix='').save()
  # Person(f_name = 'Herta', l_name = 'Beal', m_name = 't.', suffix='').save()
  # Person(f_name = 'Colby', l_name = 'Gaines', m_name = 'e.', suffix='').save()
  # Person(f_name = 'Karly', l_name = 'Burnside', m_name = 'q.', suffix='').save()
  # Person(f_name = 'Joselyn', l_name = 'Batson', m_name = 'p.', suffix='').save()
  # Person(f_name = 'Nydia', l_name = 'Strange', m_name = 'k.', suffix='').save()
  # Person(f_name = 'Herb', l_name = 'Braxton', m_name = 's.', suffix='').save()
  # Person(f_name = 'Coletta', l_name = 'Ralph', m_name = 'p.', suffix='').save()

  # Person(f_name = 'Coletta', l_name = 'Ralph', m_name = 'e.', suffix='').save()
  # Person(f_name = 'Michel', l_name = 'Callender', m_name = 'q.', suffix='').save()
  # Person(f_name = 'Laurine', l_name = 'Marble', m_name = 's.', suffix='').save()
  # Person(f_name = 'Zulema', l_name = 'Creighton', m_name = 't.', suffix='').save()
  # Person(f_name = 'Lottie', l_name = 'Jasper', m_name = 'e.', suffix='').save()
  # Person(f_name = 'Mayra', l_name = 'Garvin', m_name = 'q.', suffix='').save()
  # Person(f_name = 'Dominga', l_name = 'Billings', m_name = 'p.', suffix='').save()
  # Person(f_name = 'Donita', l_name = 'Mcintire', m_name = 'k.', suffix='').save()
  # Person(f_name = 'Shemika', l_name = 'Wasson', m_name = 's.', suffix='').save()
  # Person(f_name = 'Hallie', l_name = 'Doherty', m_name = 'p.', suffix='').save()
  
  # Person(f_name = 'Hallie', l_name = 'Doherty', m_name = 'w.', suffix='').save()
  # Person(f_name = 'Kandice', l_name = 'Farias', m_name = 'q.', suffix='').save()
  # Person(f_name = 'Erich', l_name = 'Bordelon', m_name = 's.', suffix='').save()
  # Person(f_name = 'Daniele', l_name = 'Mock', m_name = 't.', suffix='').save()
  # Person(f_name = 'Cammie', l_name = 'Qualls', m_name = 'e.', suffix='').save()
  # Person(f_name = 'Machado', l_name = 'Tran', m_name = 'q.', suffix='').save()
  # Person(f_name = 'Ayesha', l_name = 'Willingham', m_name = 'p.', suffix='').save()
  # Person(f_name = 'Decker', l_name = 'Meagan', m_name = 'k.', suffix='').save()
  # Person(f_name = 'Kory', l_name = 'Pollack', m_name = 's.', suffix='').save()
  # Person(f_name = 'Lakesha', l_name = 'Burnette', m_name = 'p.', suffix='').save()

  # Person(f_name = 'Sherry', l_name = 'parks', m_name = 's.', suffix='').save()
  # Person(f_name = 'Randy', l_name = 'gross', m_name = 'q.', suffix='').save()
  # Person(f_name = 'George', l_name = 'Moreno', m_name = 'w.', suffix='').save()
  # Person(f_name = 'Ramon', l_name = 'lowe', m_name = 'e.', suffix='').save()
  # Person(f_name = 'Hannah', l_name = 'joseph', m_name = 'r.', suffix='').save()
  # Person(f_name = 'Dana', l_name = 'nguyen', m_name = 't.', suffix='').save()
  # Person(f_name = 'James', l_name = 'owen', m_name = 'y.', suffix='').save()
  # Person(f_name = 'Raymond', l_name = 'bowers', m_name = 'u.', suffix='').save()
  # Person(f_name = 'Debra', l_name = 'hoffman', m_name = 'i.', suffix='').save()
  # Person(f_name = 'Sophie', l_name = 'mckinney', m_name = 'o.', suffix='').save()
  
  # Person(f_name = 'Jared', l_name = 'jensen', m_name = 'p.', suffix='').save()
  # Person(f_name = 'wade', l_name = 'larson', m_name = 'a.', suffix='').save()
  # Person(f_name = 'Felipe', l_name = 'hayes', m_name = 's.', suffix='').save()
  # Person(f_name = 'Janice', l_name = 'cook', m_name = 'd.', suffix='').save()
  # Person(f_name = 'Courtney', l_name = 'dennis', m_name = 'f.', suffix='').save()
  # Person(f_name = 'Amber', l_name = 'jacobs', m_name = 'g.', suffix='').save()
  # Person(f_name = 'Kurt', l_name = 'soto', m_name = 'h.', suffix='').save()
  # Person(f_name = 'Yvonne', l_name = 'harper', m_name = 'j.', suffix='').save()
  # Person(f_name = 'Carol', l_name = 'collier', m_name = 'k.', suffix='').save()
  # Person(f_name = 'Angelo', l_name = 'becker', m_name = 'l.', suffix='').save()

  # Person(f_name = 'Dianna', l_name = 'brown', m_name = 'z.', suffix='').save()
  # Person(f_name = 'Pauline', l_name = 'fox', m_name = 'x.', suffix='').save()
  # Person(f_name = 'mario', l_name = 'woods', m_name = 'c.', suffix='').save()
  # Person(f_name = 'mathew', l_name = 'bowen', m_name = 'v.', suffix='').save()
  # Person(f_name = 'lora', l_name = 'hopkins', m_name = 'b.', suffix='').save()
  # Person(f_name = 'samuel', l_name = 'bennett', m_name = 'n.', suffix='').save()
  # Person(f_name = 'billie', l_name = 'ruiz', m_name = 'm.', suffix='').save()
  # Person(f_name = 'olson', l_name = 'lawson', m_name = 'q.', suffix='').save()
  # Person(f_name = 'barton', l_name = 'young', m_name = 'w.', suffix='').save()
  # Person(f_name = 'revira', l_name = 'lane', m_name = 'e.', suffix='').save()

  # Person(f_name = 'Fisher', l_name = 'klein', m_name = 'r.', suffix='').save()
  # Person(f_name = 'bradley', l_name = 'foster', m_name = 't.', suffix='').save()
  # Person(f_name = 'carson', l_name = 'phillips', m_name = 'y.', suffix='').save()
  # Person(f_name = 'davis', l_name = 'huff', m_name = 'u.', suffix='').save()
  # Person(f_name = 'erickson', l_name = 'greer', m_name = 'i.', suffix='').save()
  # Person(f_name = 'floyd', l_name = 'kelly', m_name = 'o.', suffix='').save()
  # Person(f_name = 'hansen', l_name = 'hubbard', m_name = 'p.', suffix='').save()
  # Person(f_name = 'white', l_name = 'cummings', m_name = 'a.', suffix='').save()
  # Person(f_name = 'franklin', l_name = 'gonzales', m_name = 's.', suffix='').save()
  # Person(f_name = 'brewer', l_name = 'yates', m_name = 'd.', suffix='').save()

  # Person(f_name = 'hunter', l_name = 'neal', m_name = 'f.', suffix='').save()
  # Person(f_name = 'ortiz', l_name = 'stephens', m_name = 'g.', suffix='').save()
  # Person(f_name = 'swanson', l_name = 'hughes', m_name = 'h.', suffix='').save()
  # Person(f_name = 'clayton', l_name = 'bridges', m_name = 'j.', suffix='').save()
  # Person(f_name = 'watkins', l_name = 'spencer', m_name = 'k.', suffix='').save()
  # Person(f_name = 'townsend', l_name = 'newman', m_name = 'l.', suffix='').save()
  # Person(f_name = 'wagner', l_name = 'manning', m_name = 'z.', suffix='').save()
  # Person(f_name = 'johnston', l_name = 'lynch', m_name = 'x.', suffix='').save()
  # Person(f_name = 'willis', l_name = 'bryan', m_name = 'c.', suffix='').save()
  # Person(f_name = 'ray', l_name = 'allison', m_name = 'v.', suffix='').save()

  # Person(f_name = 'jennifer', l_name = 'richardson', m_name = 'b.', suffix='').save()
  # Person(f_name = 'kristina', l_name = 'gordon', m_name = 'n.', suffix='').save()
  # Person(f_name = 'vicki', l_name = 'torres', m_name = 'm.', suffix='').save()
  # Person(f_name = 'arlene', l_name = 'reese', m_name = 's.', suffix='').save()
  # Person(f_name = 'donna', l_name = 'lamb', m_name = 'd.', suffix='').save()
  # Person(f_name = 'rolando', l_name = 'salazar', m_name = 'a.', suffix='').save()
  # Person(f_name = 'sergio', l_name = 'webb', m_name = 'q.', suffix='').save()
  # Person(f_name = 'martin', l_name = 'dixon', m_name = 'w.', suffix='').save()
  # Person(f_name = 'mandy', l_name = 'carroll', m_name = 'e.', suffix='').save()
  # Person(f_name = 'constance', l_name = 'mendez', m_name = 'r.', suffix='').save()

  # Person(f_name = 'margie', l_name = 'walton', m_name = 'z.', suffix='').save()
  # Person(f_name = 'samantha', l_name = 'payne', m_name = 'x.', suffix='').save()
  # Person(f_name = 'francis', l_name = 'mcdaniel', m_name = 'c.', suffix='').save()
  # Person(f_name = 'lorena', l_name = 'gutierrez', m_name = 'v.', suffix='').save()
  # Person(f_name = 'everett', l_name = 'walters', m_name = 'b.', suffix='').save()
  # Person(f_name = 'jim', l_name = 'nichols', m_name = 'n.', suffix='').save()
  # Person(f_name = 'patty', l_name = 'scott', m_name = 'm.', suffix='').save()
  # Person(f_name = 'loretta', l_name = 'morrison', m_name = 'h.', suffix='').save()
  # Person(f_name = 'rosa', l_name = 'perkins', m_name = 'j.', suffix='').save()
  # Person(f_name = 'dwayne', l_name = 'buchanan', m_name = 'l.', suffix='').save()
