export function getInfo(action: string) {
  switch (action) {
    case "create":
      return `Tutaj możemy utworzyć grupę. Jeśli podamy nazwy użytkowników, zostaną oni dodani do nowo utworzonej grupy. Pole "Sufiks" służy do tego, aby na przykład, jeśli chcemy utworzyć określoną liczbę grup z sufiksem "SUR", wystarczy wpisać nazwy grup, np.: e2343, e2342, e1943. Otrzymamy skrypt, który utworzy grupy o tych nazwach i doda do każdej z nich sufiks: "GS_Firmy_e2343_SUR", "GS_Firmy_e2342_SUR", "GS_Firmy_e1943_SUR".\n\nCheckbox "Kadry i Płace" służy do wskazania kontenera, w którym chcemy utworzyć grupę. Jeśli grupa ma być przeznaczona dla kadr, należy to zaznaczyć.\n\nPrefiks "GS_Firmy" nie trzeba wpisywać.\nJeśli nazw jest więcej niż jedna, wpisujemy je przez przecinek.`;
    case "add":
      return `Tutaj możemy dodać użytkowników do grup. Pole "Sufiks" dodaje sufiks do nazwy każdej grupy.\n\nPrefiks "GS_Firmy" nie trzeba wpisywać.\nJeśli nazw jest więcej niż jedna, wpisujemy je przez przecinek.`;
    case "rx":
      return `Tutaj tworzymy skrypt, który nadaje prawa RX (Read & Execute) dla grupy w określonych folderach.\n\nNa przykład, jeśli chcemy, żeby grupa miała dostęp tylko do folderu PKO w Y:\\E1904\\IMPORT\\WB, musimy przyznać prawa RX dla folderów nadrzędnych. Wpisujemy w polu "Nazwa folderu": E1904\\IMPORT\WB, E1904\\IMPORT, E1904. Dla folderu PKO będą potrzebne inne prawa, które będzie można ustawić w innym dziale.\n\nLub inny przykład: jest wiele folderów, a w każdym z nich znajdują się podfoldery. Ale potrzebujemy, aby dostęp był tylko do jednego podfolderu w tych folderach — niech to będzie "SUR". Wpisujemy wszystkie foldery w polu "Nazwa folderu". Można skopiować i wkleić. "Spacja" również będzie działać. Następnie w polu "Sufiks" wpisujemy "SUR". Otrzymujemy skrypt, który nadaje prawa RX grupie o nazwach odpowiadających nazwom grup plus sufiks, do każdego folderu.`;
    case "m":
      return `W tej zakładce możemy nadać grupie prawa (OI)(CI)(M) — Object Inherit, Container Inherit, Modify.\n\nNa przykład, jeśli chcemy, aby grupa miała dostęp tylko do folderu PKO w Y:\\E1904\\IMPORT\\WB, musimy przyznać grupie prawa do folderu PKO. Dla folderów nadrzędnych potrzebne są inne prawa, które można nadać w zakładce "Nadanie Dostępu (:RX)".\nWpisujemy ścieżkę do folderu, a skrypt utworzy się, nadając te prawa grupie o odpowiedniej nazwie folderu`;
    case "sql":
      return `Tutaj możemy utworzyć skrypt dla SQL, który nadaje prawa użytkownikom do określonych baz.`;
    default:
      return "Wybierz działanie";
  }
}
