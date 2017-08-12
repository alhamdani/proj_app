from django.db.models import Q

def tablequery(obj, model, values):
  print (obj, model, values)
  columns = obj['columns']
  searchKey = obj['searchKey']
  limit = int(obj['limit'])
  page = int(obj['page'])
  to = page * limit;
  frm = to - limit;
  q_obj = Q()
  for item in columns:
    obj = {}
    strCol = item+'__'+'icontains'
    obj[strCol] = searchKey
    q_obj.add(Q(**obj), Q.OR)
  ls = list(model.filter(q_obj).values(*values)[ frm : to ])
  return ls

def keytolist(request, model, fields):
  searchKey = request.GET.get('key',None)
  ls = model.filter()[:15 ]
  if searchKey:
    q_obj = Q()
    for f in fields:
      obj = {}
      strCol = f + '__' + 'icontains'
      obj[strCol] = searchKey
      q_obj.add(Q(**obj), Q.OR)
    ls = model.filter(q_obj)[:15]
  return ls