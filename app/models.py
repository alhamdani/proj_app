from django.db import models
# from app.modules.party.partyModels import *
from app.modules.main.mainModels import *

from app.modules.accounting.accountingModels import *
from app.modules.document.documentModels import *

class Organization(models.Model):
  description = models.CharField(max_length = 100)
  party_id = models.CharField( max_length = 1) 

