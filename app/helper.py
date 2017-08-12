import json
def getJSONObj(request):
  undecoded_json = request.body
  decoded_json = undecoded_json.decode('utf-8')
  # converting the complex array sent via HttpRequest
  converted_into_dict = json.loads(decoded_json)
	
  return converted_into_dict


def groupAppModuleIdByGroup(all_group_app_module):
  _set = set()
  obj = {}
  # print(all_group_app_module)
  for x in all_group_app_module:
    item = all_group_app_module[x]
    group_id = item['group']['id']
    if group_id not in _set:
      _set.add(group_id)
      obj[group_id] = []
    obj[group_id].append( item['app_module_id'] )
 
  return obj