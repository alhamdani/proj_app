# from django.db import models

# class Status(models.Model):
#   description = models.CharField(max_length=50,default = 'Single')
  
#   def __str__(self):
#     return str(self.description)

# class RoletypeMaster(models.Model):
#   description = models.CharField(max_length = 200)

#   def __str__( self ):
#     return str( self.description )

# class PartyType( models.Model):
#   description = models.CharField(max_length = 200)

#   def __str__( self ):
#     return str( self.description )

# class Party( models.Model ):
#   party_type = models.ForeignKey(PartyType)
#   description = models.CharField(max_length = 200)
#   # person = models.ForeignKey( Person )

#   def __str__( self ):
#     return str( self.description )

# class Person(models.Model):
#   first_name = models.CharField(max_length = 50)
#   last_name = models.CharField(max_length = 50)
#   middle_name = models.CharField(max_length = 50)
#   suffix = models.CharField(max_length = 50, blank = True)

#   party = models.ForeignKey( Party,default = 1 ) # remove the default on final
  
#   marital_status = models.CharField( max_length = 20, default = 'single' )
  
#   def __str__(self):
#     return str(self.first_name + ' ' + self.last_name)

# class ContactType( models.Model ):
#   description = models.CharField( max_length = 200 )

#   def __str__( self ):
#     return str( self.description )

# class ContactClass( models.Model ):
#   description = models.CharField( max_length = 200 )

#   def __str__( self ):
#     return str( self.description )


# class PartyContact( models.Model ):
#   description = models.CharField(max_length = 200)
#   party = models.ForeignKey( Party )
#   contact_type = models.ForeignKey( ContactType )
#   contact_class = models.ForeignKey( ContactClass )

#   def __str__( self ):
#     return str( self.description )

# class Org(models.Model):
#   description = models.CharField(max_length = 200)
#   party = models.ForeignKey( Party )

#   def __str__( self ):
#     return str( self.description )

# class AddressType( models.Model ):
#   description = models.CharField(max_length = 200)
  
#   def __str__(self):
#     return str(self.description)

# class ZipCode( models.Model ):
#   description = models.CharField( max_length = 200 )
#   code = models.CharField( max_length = 10 )

#   def __str__(self):
#     return str(self.description)

# class Country( models.Model ):
#   description = models.CharField( max_length = 200 )

# class Region( models.Model ):
#   description = models.CharField( max_length = 200 )
#   country = models.ForeignKey( Country )

#   def __str__(self):
#     return str(self.description)

# class Province( models.Model ):
#   description = models.CharField( max_length = 200)
#   region = models.ForeignKey( Region )

#   def __str__(self):
#     return str(self.description)

# class CityMunicipality( models.Model ):
#   description = models.CharField(max_length = 200)
#   zip_code = models.ForeignKey( ZipCode )
#   province = models.ForeignKey( Province )

#   def __str__(self):
#     return str(self.description)

# class PartyAddress( models.Model ):
#   party = models.ForeignKey( Party )
#   address_type = models.ForeignKey( AddressType )
#   city_municipality = models.ForeignKey( CityMunicipality )
#   description = models.CharField( max_length = 200 )

#   def __str__(self):
#     return str(self.description)



# class PartyRoletype( models.Model ):
#   party = models.ForeignKey( Party )
#   roletype_master = models.ForeignKey( RoletypeMaster )

# class PartyRelationshipMaster( models.Model ):
#   description = models.CharField(max_length = 200)

#   def __str__( self ):
#     return str( self.description )

# class PartyRelationship( models.Model ):
#   party = models.ForeignKey( Party )
#   party_relationship_master = models.ForeignKey( PartyRelationshipMaster )

# class Account( models.Model ):
#   name = models.CharField(max_length = 50)

#   def __str__(self):
#     return str(self.name)

# # below are for navigation. Need to move if on final code
# class PageHeaderAccess(models.Model):
#   name = models.CharField(max_length = 50)
#   url = models.CharField(max_length = 50)
#   # add unique = True
#   order = models.IntegerField(default = 0)

#   def __str__(self):
#     return str(self.name)

# class PageNavAccess(models.Model):
#   name = models.CharField(max_length=50) 
#   parent_id = models.IntegerField( default = 0 )
#   url = models.CharField(max_length = 50)
#   header = models.ForeignKey(PageHeaderAccess)
#   # add unique = True
#   order = models.IntegerField(default = 0)
  
#   def __str__(self):
#     return str(self.url)


# class AccountAccess( models.Model ):
#   access = models.ForeignKey( PageNavAccess )
#   account = models.ForeignKey( Account )

# class AllUserAccess(models.Model):
#   person = models.ForeignKey( Person )
#   access = models.ForeignKey( PageNavAccess )
#   access_code = models.CharField(max_length = 4, default = '')

#   def __str__(self):
#     return str(self.person)

# class Group(models.Model):
#   description = models.CharField(max_length = 200)

#   def __str__(self):
#     return str(self.description)
    
# class GroupAccess(models.Model):
#   description = models.CharField(max_length = 200)

#   def __str__(self):
#     return str(self.description)

# class AppModules(models.Model):
#   description = models.CharField(max_length = 200)
#   parent_id = models.IntegerField()
#   url = models.CharField(max_length = 200, default = 'error')
#   # group_app_module = models.ForeignKey( GroupAppModules )

#   def __str__(self):
#     return str(self.description)

# class GroupAppModules(models.Model):
#   group = models.ForeignKey(Group)
#   app_module = models.ForeignKey(AppModules)
#   group_access = models.ForeignKey(GroupAccess)

# class PartyGroup(models.Model):
#   party = models.ForeignKey(Party)
#   group = models.ForeignKey(Group)
  
#   def __str__(self):
#     return str(self.party) + ' ' + str(self.group);

# class PartyGroupOnCustom( models.Model ):

#   party = models.ForeignKey( Party )
#   app_module = models.ForeignKey( AppModules )
#   group_access = models.ForeignKey( GroupAccess )
#   group = models.ForeignKey( Group )

# class Access(models.Model):
#   code = models.CharField(max_length = 20)
#   description = models.CharField(max_length = 200)

#   def __str__(self):
#     return str(self.description) + ' ' + str(self.code)

# class AccessOnAccessGroup(models.Model):
#   access = models.ForeignKey(Access)
#   group_access = models.ForeignKey(GroupAccess)

#   def __str__(self):
#     return str(self.group_access) + ' ' + str(self.access)


