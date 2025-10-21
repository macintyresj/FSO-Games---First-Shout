/** @format */

// questions.js
const questions = [
    { text: "Which forms need to be attached if you have true-ups or drafts K-1s on your FOF?", options: [ "1065", "1120", "8082", "1040"], correct: 2 },
    { text: "Why include a corporation in a fund structure?", options: ["Block ECI/FDAP to foreign partners", "For cash management", "For bookkeeping only", "To issue dividends"], correct: 0 },
    { text: "If K-1 Item L ending balance is negative, you should?", options: ["Cry", "Ask senior", "Ignore", "Track outside basis"], correct: 3 },
    { text: "What form must be filed within 30 days of adopting a plan of complete liquidation?", options: ["1120", "926", "966", "4797"], correct: 2 },
    { text: "Capital loss carrybacks for corporations?", options: ["Carry back 5 yrs", "Carry forward only", "Carry back 3 & forward 5", "Carry back 1 & forward 20"], correct: 2 },
    { text: "What's a dividend?", options: ["Distribution out of E&P", "Return of capital", "Capital gain", "Loan repayment"], correct: 0 },
    { text: "Which type of investors are specially sensitive to UBTI?", options: ["Tax-exempt", "Domestic C Corp", "Foreign Trust", "Individual"], correct: 0 },
    { text: "Tax implication for partner distribution exceeding basis?", options: ["Fully taxable ordinary", "Return of capital", "Capital gain", "Exempt"], correct: 2 },
    { text: "Why complete Form 8949?", options: ["Short/long term capital gains/losses", "Income & deductions", "Schedule M-3 reporting", "Basis adjustment"], correct: 0 },
    { text: "Which info return reports interests in foreign disregarded entities?", options: ["8858", "8865", "8621", "8804"], correct: 0 },
    { text: "If book depreciation > tax depreciation, is it favorable?", options: ["Yes", "No"], correct: 1 },
    { text: "Primary purpose of tax basis balance sheet?", options: ["GAAP compliance", "Depreciation calculation", "Owner-level basis & tax consequences", "Reconcile bank statements"], correct: 2 },
    { text: "When prepare AICPA checklists?", options: ["Before tax return prep", "After tax return prep", "Anytime", "Never"], correct: 0 },
    { text: "Reasons to update underlying estimate K-1 with actual K-1?", options: ["Most up-to-date info, avoid future 8082, avoid next year true-up", "Only for auditing", "Optional", "Not needed"], correct: 0 },
    { text: "Upon sale of business property, why consider recapture?", options: ["Increase taxable income", "Reduce taxable income", "Change income character", "None"], correct: 2 },
    { text: "Which statements true regarding capital loss carrybacks?", options: ["5 yr carryback", "Carryforward only", "3 yrs back & 5 forward", "1 yr back & 20 forward"], correct: 2 },
    { text: "Which is NOT an entity classification election on Form 8832?", options: ["LLC", "Disregarded Entity", "Corporation", "Partnership"], correct: 0 },
    { text: "Should 743b adjustments in K-1 be reclassed?", options: ["Yes", "No"], correct: 0 },
    { text: "Initial transaction of a Wash Sale?", options: ["Realized loss", "Realized gain", "Deferred loss", "Deferred gain"], correct: 0 },
    { text: "New partner admitted: typical tax implication?", options: ["Recognize gain", "Adjust basis", "No immediate implication", "None"], correct: 1 },
    { text: "When does a Straddle occur?", options: ["Offset positions same asset & exp date", "Different assets", "Same asset diff exp", "None"], correct: 0 },
    { text: "Which waterfall uses “deal by deal” methodology?", options: ["European", "American", "Australian"], correct: 1 },
    { text: "PFICs with QEF election, how is income reported?", options: ["Include in Form 8621", "Ignore", "Only in K-3", "None"], correct: 0 },
    { text: "IRC §368 requirement for tax-free merger?", options: ["Within 30 days", "Cash for all assets", "Plan of reorganization", "Target dissolved immediately"], correct: 2 },
    { text: "EY tool to report personal & family holdings?", options: ["GMS", "TIM", "CTR", "CAM"], correct: 0 },
    { text: "Red flags reviewing Book/Tax Capital accounts?", options: ["Ending book capital mismatch", "Income mismatch", "Both", "None"], correct: 2 },
    { text: "Bonus depreciation rate after Jan 19, 2025?", options: ["40%", "60%", "80%", "100%"], correct: 3 },
    { text: "Why qualified dividends better than non-qualified?", options: ["Lower tax rate", "Same tax rate", "Higher tax rate", "Exempt"], correct: 0 },
    { text: "Cash contribution to foreign partnership, which form & category?", options: ["8865 Cat 3", "8865 Cat 1", "1065", "1120"], correct: 0 },
    { text: "Partner with suspended losses & excess distribution: report?", options: ["Use losses to offset", "Recognize as capital gain", "Apply losses to extent of basis", "Ignore"], correct: 2 },
    { text: "Wash sale timeframe?", options: ["61 days", "30 days", "90 days", "1 year"], correct: 0 },
    { text: "IRC §752: decrease in partner liabilities effect?", options: ["Increase basis", "Decrease basis", "Tax credit", "No effect"], correct: 1 },
    { text: "Partnership investment interest expense (Line 13H), 163J?", options: ["Yes", "No", "Only if corp", "Optional"], correct: 1 },
    { text: "Partner contributes property: built-in gain allocated?", options: ["20k", "40k", "60k", "80k"], correct: 1 },
    { text: "NOL limitation for Corp tax returns?", options: ["80%", "100%", "Only pre-2018", "Unlimited"], correct: 0 },
    { text: "Section 163(j) business interest: effect of K-1 investment income?", options: ["No impact", "Backed out ATI", "1:1 deduction", "Ignored"], correct: 2 },
    { text: "Can capital gains be US sourced instead of partner?", options: ["Yes", "No"], correct: 0 },
    { text: "BMC?", options: ["Brand, Marketing & Communications", "Business Management & Compliance", "Budget, Marketing & Costs"], correct: 0 },
    { text: "TIM?", options: ["Total Investment Management", "Taxable Income Module",  "Treasury Internal Metrics"], correct: 1 },
    { text: "CTR?", options: ["Corporate Tax Review", "Capital Transaction Report", "Complex tax reclass"], correct: 2 },
    { text: "¿Qué cantante argentino ganó un Grammy en 2023?", options: [ "Duki", "Tini","Bizarrap", "Trueno"], correct: 2 },
    { text: "¿Cuál es el río más largo de Argentina?", options: [ "Uruguay", "Paraná", "Pilcomayo", "Salado"], correct: 1 },
    { text: "¿Qué artista pintó 'La noche estrellada'?", options: [ "Pablo Picasso", "Claude Monet", "Salvador Dalí", "Vincent van Gogh"], correct: 3 },
    { text: "¿Qué videojuego se hizo famoso por el personaje 'Mario'?", options: ["Sonic", "Super Mario Bros",  "Donkey Kong", "Zelda"], correct: 1 },
    { text: "¿Qué planeta es conocido como el 'planeta rojo'?", options: ["Júpiter", "Marte", "Venus", "Mercurio"], correct: 1 },
    { text: "¿Cuál de estos es un invento argentino?", options: ["Bypass cardíaco", "Teléfono", "Radio", "Submarino"], correct: 0 },
    { text: "¿Qué actriz protagoniza la película 'Barbie' (2023)?", options: ["Margot Robbie", "Emma Stone", "Scarlett Johansson", "Anne Hathaway"], correct: 0 },
    { text: "¿Qué provincia argentina es famosa por sus Cataratas?", options: ["Salta", "Misiones", "Jujuy", "Corrientes"], correct: 1 },
    { text: "¿En qué ciudad se celebra el festival de rock 'Cosquín Rock'?", options: ["Córdoba", "Buenos Aires", "Rosario", "San Juan"], correct: 0 },
    { text: "¿En qué continente está Egipto?", options: ["África", "Asia", "Europa", "Oceanía"], correct: 0 },
    { text: "¿Qué animal es símbolo nacional de Australia?", options: ["Koala", "Canguro", "Emú", "Dingo"], correct: 1 },
    { text: "¿Cuántos planetas hay en el sistema solar?", options: ["8", "9", "7", "10"], correct: 0 },
    { text: "¿Qué país tiene forma de bota?", options: ["Italia", "Grecia", "Croacia", "Portugal"], correct: 0 },
    { text: "¿Qué videojuego popular incluye al personaje Pikachu?", options: ["Mario Kart", "Minecraft", "Pokémon", "Fortnite"], correct: 2 },
    { text: "¿Cuál fue el primer país en enviar un humano al espacio?", options: [ "Estados Unidos", "China", "Alemania", "Unión Soviética"], correct: 3 },
    { text: "¿En qué año llegó el hombre a la Luna?", options: ["1972", "1959", "1980", "1969"], correct: 3 },
    { text: "¿Quién pintó 'La Mona Lisa'?", options: [ "Miguel Ángel", "Leonardo da Vinci","Rafael", "Botticelli"], correct: 1 },
    { text: "¿Qué continente tiene más países?", options: ["Europa", "África", "Asia", "América"], correct: 1 },
    { text: "¿Cuántos huesos tiene el cuerpo humano adulto aproximadamente?", options: [ "180", "206", "210", "300"], correct: 1 },
    { text: "¿Qué país inventó la pizza?", options: ["Italia", "Francia", "Grecia", "España"], correct: 0 },
    { text: "¿Cuál es el océano más grande del mundo?", options: ["Atlántico", "Índico", "Pacífico",  "Ártico"], correct: 2 },  
    { text: "¿Qué gas hace que los globos floten?", options: ["Oxígeno", "Hidrógeno", "Helio", "Dióxido de carbono"], correct: 2 },
    { text: "¿En qué país nació el sushi?", options: [ "China", "Corea del Sur", "Japón", "Tailandia"], correct: 2 },
    { text: "¿Cuántos minutos tiene una hora y media?", options: ["90", "80", "100", "120"], correct: 0 },
    { text: "¿Qué país ganó más Copas del Mundo de fútbol masculino?", options: ["Brasil", "Alemania", "Italia", "Argentina"], correct: 0 },
    { text: "¿Qué número romano representa al 50?", options: [ "X", "C", "L","V"], correct: 2 },
    { text: "¿Qué escritor creó a Harry Potter?", options: ["Suzanne Collins", "Rick Riordan", "Stephen King", "J.K. Rowling"], correct: 3 },
    { text: "¿Qué parte del cuerpo produce la insulina?", options: ["Hígado", "Riñón", "Estómago", "Páncreas"], correct: 3 },
    { text: "¿Cuál es el país más pequeño del mundo?", options: [ "Mónaco", "Liechtenstein", "Malta", "Vaticano",], correct: 3 },
    { text: "¿Qué elemento de la tabla periódica tiene el símbolo 'Na'?", options: ["Sodio", "Nitrógeno", "Níquel", "Neón"], correct: 0 },
  ];












