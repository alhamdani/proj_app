from django.db import models
# from app.modules.party.partyModels import *
from app.modules.main.mainModels import *
from app.modules.product.productModels import *
from app.modules.location.locationModels import *


class documentType(models.Model):
  code = models.CharField(max_length=50)
  description = models.CharField(max_length=200)

  def __str__( self ):
    return str( self.description )

class documentHeader(models.Model):
  document_no = models.CharField(max_length=50)
  doctype = models.ForeignKey(documentType)
  party = models.ForeignKey(Party, related_name='party')
  company = models.ForeignKey(Party, related_name='company')
  location = models.ForeignKey(Location)
  status = models.IntegerField()
  docdate = models.DateField()
  created_by = models.ForeignKey(Party, related_name='created_by')
  date_created = models.DateTimeField()
  remarks = models.TextField()

  @property
  def statusname(self):
    if self.status == 0:
      return 'For Approval'
    return 'Approved'

class documentDetail(models.Model):
  docheader = models.ForeignKey(documentHeader)
  product = models.ForeignKey(Product)
  quantity = models.DecimalField(max_digits=11, decimal_places=5)
  unit_price = models.DecimalField(max_digits=11, decimal_places=5)
  delivery_date = models.DateField()
  comments = models.TextField()

  

  
