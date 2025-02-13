import {useState} from "react";
import styles from "./code.module.scss";
import {IoCopyOutline} from "react-icons/io5";

type CodeProps = {
	action: string;
	users: string;
	groups: string;
};

export const Code = ({action, users, groups}: CodeProps) => {
	const [copyButtonText, setCopyButtonText] = useState("Copy");

	const usersArray = users.split(/[\s,]+/).filter(Boolean);
	const groupsArray = groups.split(/[\s,]+/).filter(Boolean);

	function createGroup() {
	}

	function addUserToGroup(users: string[], groups: string[]) {
		if (users.length === 1 && groups.length === 1) {
			return `$user = "${usersArray[0]}"\n$group = "GS_Firmy_${groupsArray[0]}"\n\nif (Get-ADGroup -Filter {Name -eq $group}) {
    if (Get-ADUser -Identity $user) {
        try {
            Add-ADGroupMember -Identity $group -Members $user
            Write-Host "User $user has been successfully added to the group: $group"
        } catch {
            Write-Host "Error adding user $user to the group: $group. Details: $_"
        }
    } else {
        Write-Host "User $user not found in Active Directory."
    }
} else {
    Write-Host "Group $group not found in Active Directory."
}`;
		} else if (users.length === 1) {
			return `$user = "${usersArray[0]}"\n$groups = @(${groupsArray
				.map((group) => `"GS_Firmy_${group}"`)
				.join(", ")})\n\nif (Get-ADUser -Identity $UserName) {
    foreach ($GroupName in $Groups) {
        if (Get-ADGroup -Filter {Name -eq $GroupName}) {
            try {
                Add-ADGroupMember -Identity $GroupName -Members $UserName
                Write-Host "User '$UserName' has been successfully added to group '$GroupName'."
            } catch {
                Write-Host "Error adding user '$UserName' to group '$GroupName'. Details: $_"
            }
        } else {
            Write-Host "Group '$GroupName' not found in Active Directory."
        }
    }
} else {
    Write-Host "User '$UserName' not found in Active Directory."
}`;
		} else if (groups.length === 1) {
			return `$users = @(${usersArray
				.map((user) => `"${user}"`)
				.join(", ")})\n$group = "GS_Firmy_${
				groupsArray[0]
			}"\n\nif (Get-ADGroup -Filter {Name -eq $GroupName}) {
    foreach ($UserName in $Users) {
        if (Get-ADUser -Identity $UserName) {
            try {
                Add-ADGroupMember -Identity $GroupName -Members $UserName
                Write-Host "User '$UserName' has been successfully added to group '$GroupName'."
            } catch {
                Write-Host "Error adding user '$UserName' to group '$GroupName'. Details: $_"
            }
        } else {
            Write-Host "User '$UserName' not found in Active Directory."
        }
    }
} else {
    Write-Host "Group '$GroupName' not found in Active Directory."
}`;
		} else if (users.length > 1 && groups.length > 1) {
			return `$users = @(${usersArray
				.map((user) => `"${user}"`)
				.join(", ")})\n$groups = @(${groupsArray
				.map((group) => `"GS_Firmy_${group}"`)
				.join(", ")})\n\nforeach ($UserName in $Users) {
    try {
        $user = Get-ADUser -Identity $UserName -ErrorAction Stop
        foreach ($GroupName in $Groups) {
            if (Get-ADGroup -Filter {Name -eq $GroupName}) {
                try {
                    Add-ADGroupMember -Identity $GroupName -Members $UserName
                    Write-Host "User '$UserName' has been successfully added to group '$GroupName'."
                } catch {
                    Write-Host "Error adding user '$UserName' to group '$GroupName'. Details: $_"
                }
            } else {
                Write-Host "Group '$GroupName' not found in Active Directory."
            }
        }
    } catch {
        Write-Host "User '$UserName' not found in Active Directory."
    }
}`;
		} else {
			return "Wpisz użytkownika(-ów) i grupę(-y), aby wygenerować kod";
		}
	}

	async function copyToClipboard() {
		await navigator.clipboard.writeText(addUserToGroup(usersArray, groupsArray));
		setCopyButtonText("Copied");

		setTimeout(() => {
			setCopyButtonText("Copy");
		}, 2000);
	}

	return (
		<div className={styles.codeWrapper}>
			<div className={styles.codeContainer}>
				<header className={styles.codeHeader}>
					<span>Powershell</span>

					<button onClick={copyToClipboard}>
						<IoCopyOutline/>
						<span>{copyButtonText}</span>
					</button>
				</header>

				<pre className={styles.codeBlock}>
          <code>
            {action === "add"
	            ? addUserToGroup(usersArray, groupsArray)
	            : "asdas"}
          </code>
        </pre>
			</div>
		</div>
	);
};
