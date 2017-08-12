from django.db import models
# from app.modules.party.partyModels import *
from app.modules.main.mainModels import *

class GLAccountType(models.Model):
  description = models.CharField(max_length = 200)

  def __str__( self ):
    return str( self.description )

class GLAccount(models.Model):
  code = models.CharField(max_length = 20)
  description = models.CharField(max_length = 200)
  details = models.CharField(max_length = 500)
  account_type = models.ForeignKey(GLAccountType)

  def __str__( self ):
    return str( self.description )

class PeriodType(models.Model):
  description = models.CharField(max_length = 50)

  def __str__( self ):
    return str( self.description )

class AccountingPeriod(models.Model):
  code = models.CharField(max_length = 20)
  description = models.CharField(max_length = 200)
  period_type = models.ForeignKey(PeriodType)
  from_date = models.DateField()
  thru_date = models.DateField()

  def __str__( self ):
    return str( self.description )

class OrganizationalGLAccount(models.Model):
  party = models.ForeignKey(Party)
  gl_account = models.ForeignKey(GLAccount)
  accounting_period = models.ForeignKey(AccountingPeriod)
  from_date = models.DateField()
  thru_date = models.DateField()