$names = @("E0121", "E0201", "E0209", "E0318", "E0401", "E0405", "E0605", "E0614", "E0616", "E0620", "E0702", "E0707", "E0708", "E0713", "E0715", "E0717", "E0719", "E0720", "E0721", "E0801", "E0910", "E1001", "E1202", "E1204", "E1602", "E1603", "E1606", "E1610", "E1701", "E1710", "E1908", "E1919", "E1920", "E2001", "E2002", "E2005", "E2007", "E2010", "E2102", "E2201", "E2302", "E2602", "H0401", "H0402", "H0501", "H0701", "H0801", "H1001", "H1101", "H1103", "H1901", "H1902", "H1903", "H1904", "H1905", "H1906", "H1907", "H1908", "H1910", "K0101", "K0102", "K0103", "K0204", "K0205", "K0206", "K0207", "K0208", "K0305", "K0306", "K0401", "K0402", "K0404", "K0405", "K0605", "K0705", "K0901", "K1002", "K1102", "K1103", "K1104", "K1201", "K1407", "K1409", "K1410", "K1601", "K1701", "K1803", "K1905", "K2001", "K2007", "K2302", "K2702")

foreach ($name in $names) {
    icacls "D:\Firmy\Kadry_i_Place\$name\INNE" /grant "GS_Firmy_KadryIPlace_${name}_INNE_PFRON:RX"
}

#-----------------------------------------------------------------------------------------------------------------------

$names = @("E0121", "E0201", "E0209", "E0318", "E0401", "E0405", "E0605", "E0614", "E0616", "E0620", "E0702", "E0707", "E0708", "E0713", "E0715", "E0717", "E0719", "E0720", "E0721", "E0801", "E0910", "E1001", "E1202", "E1204", "E1602", "E1603", "E1606", "E1610", "E1701", "E1710", "E1908", "E1919", "E1920", "E2001", "E2002", "E2005", "E2007", "E2010", "E2102", "E2201", "E2302", "E2602", "H0401", "H0402", "H0501", "H0701", "H0801", "H1001", "H1101", "H1103", "H1901", "H1902", "H1903", "H1904", "H1905", "H1906", "H1907", "H1908", "H1910", "K0101", "K0102", "K0103", "K0204", "K0205", "K0206", "K0207", "K0208", "K0305", "K0306", "K0401", "K0402", "K0404", "K0405", "K0605", "K0705", "K0901", "K1002", "K1102", "K1103", "K1104", "K1201", "K1407", "K1409", "K1410", "K1601", "K1701", "K1803", "K1905", "K2001", "K2007", "K2302", "K2702")

foreach ($name in $names) {
    icacls "D:\Firmy\Kadry_i_Place\$name\LISTY_PLAC" /grant "GS_Firmy_KadryIPlace_${name}_LISTY_PLAC:(OI)(CI)(M)"
    icacls "D:\Firmy\Kadry_i_Place\$name\PIT" /grant "GS_Firmy_KadryIPlace_${name}_PIT:(OI)(CI)(M)"
    icacls "D:\Firmy\Kadry_i_Place\$name\PPK" /grant "GS_Firmy_KadryIPlace_${name}_PPK:(OI)(CI)(M)"
    icacls "D:\Firmy\Kadry_i_Place\$name\ZUS" /grant "GS_Firmy_KadryIPlace_${name}_ZUS:(OI)(CI)(M)"
}

#-----------------------------------------------------------------------------------------------------------------------

# Define the variables for the OU path and group name
$OUPath = "OU=Grupy,OU=Szwak,DC=szwak,DC=local"
$GroupName = "YourGroupName"

# Create a new group object in Active Directory without description
New-ADGroup -Name $GroupName -Path $OUPath -GroupScope Global -GroupCategory Security

Write-Host "Group $GroupName successfully created in $OUPath"

#-----------------------------------------------------------------------------------------------------------------------

# Define the variables for the OU path
$OUPath = "OU=Grupy,OU=Szwak,DC=szwak,DC=local"

# Define an array with the names of the groups you want to create
$GroupNames = @("Group1", "Group2", "Group3")

# Loop through the array and create each group without descriptions
foreach ($GroupName in $GroupNames) {
    New-ADGroup -Name $GroupName -Path $OUPath -GroupScope Global -GroupCategory Security
    Write-Host "Group $GroupName successfully created in $OUPath"
}

#-----------------------------------------------------------------------------------------------------------------------

# Define the variables for the OU path, group name, and user name
$OUPath = "OU=Grupy,OU=Szwak,DC=szwak,DC=local"
$GroupName = "YourGroupName"
$UserName = "sAMAccountNameOfUser"  # sAMAccountName of the user to be added

# Create a new group object in Active Directory without description
New-ADGroup -Name $GroupName -Path $OUPath -GroupScope Global -GroupCategory Security
Write-Host "Group $GroupName successfully created in $OUPath"

# Add the user to the group
Add-ADGroupMember -Identity $GroupName -Members $UserName
Write-Host "User $UserName successfully added to group $GroupName"

#-----------------------------------------------------------------------------------------------------------------------

# Define the variables for the OU path, group name, and user names
$OUPath = "OU=Grupy,OU=Szwak,DC=szwak,DC=local"
$GroupName = "YourGroupName"
$UserNames = @("sAMAccountNameOfUser1", "sAMAccountNameOfUser2", "sAMAccountNameOfUser3") # Array of user sAMAccountNames

# Create a new group object in Active Directory without description
New-ADGroup -Name $GroupName -Path $OUPath -GroupScope Global -GroupCategory Security
Write-Host "Group $GroupName successfully created in $OUPath"

# Loop through the array and add each user to the group
foreach ($UserName in $UserNames) {
    Add-ADGroupMember -Identity $GroupName -Members $UserName
    Write-Host "User $UserName successfully added to group $GroupName"
}

#-----------------------------------------------------------------------------------------------------------------------

# Define the variables for the OU path
$OUPath = "OU=Grupy,OU=Szwak,DC=szwak,DC=local"

# Define an array with the names of the groups you want to create
$GroupNames = @("Group1", "Group2", "Group3")

# Define the user sAMAccountName you want to add to each group
$UserName = "sAMAccountNameOfUser"  # sAMAccountName of the user to be added

# Loop through the array of groups
foreach ($GroupName in $GroupNames) {
    # Create the group
    New-ADGroup -Name $GroupName -Path $OUPath -GroupScope Global -GroupCategory Security
    Write-Host "Group $GroupName successfully created in $OUPath"

    # Add the user to the group
    Add-ADGroupMember -Identity $GroupName -Members $UserName
    Write-Host "User $UserName successfully added to group $GroupName"
}

#-----------------------------------------------------------------------------------------------------------------------

# Define the variables for the OU path
$OUPath = "OU=Grupy,OU=Szwak,DC=szwak,DC=local"

# Define an array with the names of the groups you want to create
$GroupNames = @("Group1", "Group2")

# Define an array with the user sAMAccountNames you want to add to each group
$UserNames = @("User1", "User2", "User3")

# Loop through the array of groups
foreach ($GroupName in $GroupNames) {
    # Create the group
    New-ADGroup -Name $GroupName -Path $OUPath -GroupScope Global -GroupCategory Security
    Write-Host "Group $GroupName successfully created in $OUPath"

    # Add users to the group
    foreach ($UserName in $UserNames) {
        Add-ADGroupMember -Identity $GroupName -Members $UserName
        Write-Host "User $UserName successfully added to group $GroupName"
    }
}

#-----------------------------------------------------------------------------------------------------------------------


#-----------------------------------------------------------------------------------------------------------------------


#-----------------------------------------------------------------------------------------------------------------------


#-----------------------------------------------------------------------------------------------------------------------


#-----------------------------------------------------------------------------------------------------------------------


#-----------------------------------------------------------------------------------------------------------------------

