$names = @("E0121", "E0201", "E0209", "E0318", "E0401", "E0405", "E0605", "E0614", "E0616", "E0620", "E0702", "E0707", "E0708", "E0713", "E0715", "E0717", "E0719", "E0720", "E0721", "E0801", "E0910", "E1001", "E1202", "E1204", "E1602", "E1603", "E1606", "E1610", "E1701", "E1710", "E1908", "E1919", "E1920", "E2001", "E2002", "E2005", "E2007", "E2010", "E2102", "E2201", "E2302", "E2602", "H0401", "H0402", "H0501", "H0701", "H0801", "H1001", "H1101", "H1103", "H1901", "H1902", "H1903", "H1904", "H1905", "H1906", "H1907", "H1908", "H1910", "K0101", "K0102", "K0103", "K0204", "K0205", "K0206", "K0207", "K0208", "K0305", "K0306", "K0401", "K0402", "K0404", "K0405", "K0605", "K0705", "K0901", "K1002", "K1102", "K1103", "K1104", "K1201", "K1407", "K1409", "K1410", "K1601", "K1701", "K1803", "K1905", "K2001", "K2007", "K2302", "K2702")

foreach ($name in $names) {
    icacls "D:\Firmy\Kadry_i_Place\$name\INNE" /grant "GS_Firmy_KadryIPlace_${name}_INNE_PFRON:RX"
}

#-----------------------------------------------------------------------------------------------------------

$names = @("E0121", "E0201", "E0209", "E0318", "E0401", "E0405", "E0605", "E0614", "E0616", "E0620", "E0702", "E0707", "E0708", "E0713", "E0715", "E0717", "E0719", "E0720", "E0721", "E0801", "E0910", "E1001", "E1202", "E1204", "E1602", "E1603", "E1606", "E1610", "E1701", "E1710", "E1908", "E1919", "E1920", "E2001", "E2002", "E2005", "E2007", "E2010", "E2102", "E2201", "E2302", "E2602", "H0401", "H0402", "H0501", "H0701", "H0801", "H1001", "H1101", "H1103", "H1901", "H1902", "H1903", "H1904", "H1905", "H1906", "H1907", "H1908", "H1910", "K0101", "K0102", "K0103", "K0204", "K0205", "K0206", "K0207", "K0208", "K0305", "K0306", "K0401", "K0402", "K0404", "K0405", "K0605", "K0705", "K0901", "K1002", "K1102", "K1103", "K1104", "K1201", "K1407", "K1409", "K1410", "K1601", "K1701", "K1803", "K1905", "K2001", "K2007", "K2302", "K2702")

foreach ($name in $names) {
    icacls "D:\Firmy\Kadry_i_Place\$name\LISTY_PLAC" /grant "GS_Firmy_KadryIPlace_${name}_LISTY_PLAC:(OI)(CI)(M)"
    icacls "D:\Firmy\Kadry_i_Place\$name\PIT" /grant "GS_Firmy_KadryIPlace_${name}_PIT:(OI)(CI)(M)"
    icacls "D:\Firmy\Kadry_i_Place\$name\PPK" /grant "GS_Firmy_KadryIPlace_${name}_PPK:(OI)(CI)(M)"
    icacls "D:\Firmy\Kadry_i_Place\$name\ZUS" /grant "GS_Firmy_KadryIPlace_${name}_ZUS:(OI)(CI)(M)"
}

#-----------------------------------------------------------------------------------------------------------

# Створення групи і додавання користувача до групи
$GroupName = "NewGroupName" # Назва нової групи
$UserName = "tymczasowy"  # Ім'я користувача, якого потрібно додати до групи
$OU = "OU=Grupy,OU=Szwak,DC=szwak,DC=local" # Організаційний підрозділ

$group = Get-ADGroup -Filter {Name -eq $GroupName}
if ($group) {
    Write-Host "Group '$GroupName' already exists."
} else {
    New-ADGroup -Name $GroupName -Path $OU -GroupScope Global -GroupCategory Security
    Write-Host "Group '$GroupName' has been created."
}

if (Get-ADUser -Identity $UserName) {
    Add-ADGroupMember -Identity $GroupName -Members $UserName
    Write-Host "User '$UserName' has been successfully added to group '$GroupName'."
} else {
    Write-Host "User '$UserName' not found in Active Directory."
}

#-----------------------------------------------------------------------------------------------------------

# Cтворює одну групу та додає до неї декілька користувачів
$GroupName = "NewGroupName" # Назва нової групи
$Users = @("user1", "user2", "user3")  # Імена користувачів, яких потрібно додати до групи
$OU = "OU=Grupy,OU=Szwak,DC=szwak,DC=local" # Організаційний підрозділ

$group = Get-ADGroup -Filter {Name -eq $GroupName}
if ($group) {
    Write-Host "Group '$GroupName' already exists."
} else {
    New-ADGroup -Name $GroupName -Path $OU -GroupScope Global -GroupCategory Security
    Write-Host "Group '$GroupName' has been created."
}

foreach ($UserName in $Users) {
    if (Get-ADUser -Identity $UserName) {
        Add-ADGroupMember -Identity $GroupName -Members $UserName
        Write-Host "User '$UserName' has been successfully added to group '$GroupName'."
    } else {
        Write-Host "User '$UserName' not found in Active Directory."
    }
}

#-----------------------------------------------------------------------------------------------------------

# Cтворює декілька груп та додає до неї 1 користувача
$UserName = "yourUserName"  # Ім'я користувача, якого потрібно додати до груп
$Groups = @("NewGroup1", "NewGroup2", "NewGroup3")  # Імена нових груп
$OU = "OU=Grupy,OU=Szwak,DC=szwak,DC=local" # Організаційний підрозділ

# Перевірка на наявність користувача
try {
    $user = Get-ADUser -Identity $UserName -ErrorAction Stop
    foreach ($GroupName in $Groups) {
        # Перевірка на наявність групи
        if (Get-ADGroup -Filter {Name -eq $GroupName}) {
            Write-Host "Group '$GroupName' already exists."
        } else {
            try {
                # Створення нової групи без опису
                New-ADGroup -Name $GroupName -Path $OU -GroupScope Global -GroupCategory Security
                Write-Host "Group '$GroupName' has been created."
                
                # Додавання користувача до новоствореної групи
                Add-ADGroupMember -Identity $GroupName -Members $UserName
                Write-Host "User '$UserName' has been successfully added to group '$GroupName'."
            } catch {
                Write-Host "Error creating group '$GroupName' or adding user '$UserName' to the group. Details: $_" -ForegroundColor Red
            }
        }
    }
} catch {
    Write-Host "User '$UserName' not found in Active Directory."
}



