let ascii_art = String.raw`
_________                     .__        _________                     __  .__  _____  ________         .__  .__               
\_   ___ \  _________    ____ |  |__    /   _____/_____   ____________/  |_|__|/ ____\ \_____  \   ____ |  | |__| ____   ____  
/    \  \/ /  _ \__  \ _/ ___\|  |  \   \_____  \\____ \ /  _ \_  __ \   __\  \   __\   /   |   \ /    \|  | |  |/    \_/ __ \ 
\     \___(  <_> ) __ \\  \___|   Y  \  /        \  |_> >  <_> )  | \/|  | |  ||  |    /    |    \   |  \  |_|  |   |  \  ___/ 
 \______  /\____(____  /\___  >___|  / /_______  /   __/ \____/|__|   |__| |__||__|    \_______  /___|  /____/__|___|  /\___  >
        \/           \/     \/     \/          \/|__|                                          \/     \/             \/     \/ 
`

console.log(ascii_art);
console.log("\nBy Coach Sportif Virtuel")

let json = `
{
	"muscu" : [
		{
			"titre" : "tractions",
			"description" : "Faites 40 tractions (autant de séries que vous le souhaitez).",
			"points" : 200
		},

		{
			"titre" : "dips",
			"description" : "Faites 40 dips pour avoir des pecs énorme !",
			"points" : 200
		},

		{
			"titre" : "pompes",
			"description" : "Faites 100 pompes pour être beau gosse sur la plage",
			"points" : 250
		},

		{
			"titre" : "fentes",
			"description" : "Faites 100 fentes sur chaques jambes pour être énorme et sec.",
			"points" : 250
		},

		{
			"titre" : "squats",
			"description" : "Faites 100 squats pour avoir des fessiers d enfer !",
			"points" : 250
		},

		{
			"titre" : "abdos",
			"description" : "Faites 100 crunchs pour des abdos bien dessinés !",
			"points" : 250
		}
	],
	
	"cardio" : [
		{
			"titre" : "jumpingjack",
			"description" : "Si vous faites 300 jumping jack dans les 24 prochaines heures...",
			"points" : 350
		},

		{
			"titre" : "mountainclimbers",
			"description" : "Pensez à vos abdos ! 300 mountainclimbers pour de belles tablettes !",
			"points" : 350
		},

		{
			"titre" : "burpees",
			"description" : "Rien de mieux que des bonnes burpees, 100 burppees semble être un bon défi.",
			"points" : 500
		},

		{
			"titre" : "lever_de_genou",
			"description" : "Pas cap de faire 300 lever de genoux",
			"points" : 350
		},

		{
			"titre" : "sprints",
			"description" : "Les champions n auront pas peur de faire 10 sprints aujourd hui.",
			"points" : 300
		}
	]
}
`;

let Defi = {
	changeDefi : (categorie, defis, divId) => {
		localStorage.categorie = categorie;
		document.getElementById(divId).innerHTML = `
			<p class="my_font">Vous êtes sur le point de faire une série de : ` + defis + `</p>
			<img src="` + defis + `.gif">
		`;
	},

	getTemps : (id) => {
		let element = document.getElementById(id);
		let date = new Date();
		element.innerHTML = 'Nous sommes le ' + date.toLocaleString();
		setTimeout(() => {Defi.getTemps(id);}, 1000);
	},

	winDefi : (idCategorie, idSerie, pseudo) => {
		let categorie = localStorage.categorie;
		let points;
		let date = new Date();

		if (categorie == "muscu") {
			points = localStorage.muscuPoint;
		} else if (categorie == "cardio") {
			points = localStorage.cardioPoint;
		} else {
			return 0;
		}

		DataBase.ecrire({
			"points" : points,
			"date" : date.toDateString()
		});

		alert('Bravo ! Un nouveau défi réussi !');
	},

	choisiDefi : () => {
		if (!window.sessionStorage.muscuDefi) {
			json = JSON.parse(json);

			SerieMuscu = json.muscu[Math.floor(Math.random() * json.muscu.length)];
			SerieCardio = json.cardio[Math.floor(Math.random() * json.cardio.length)];

			window.sessionStorage.muscuDefi = SerieMuscu.description;
			window.sessionStorage.cardioDefi = SerieCardio.description;
			window.sessionStorage.muscuPoint = SerieMuscu.points;
			window.sessionStorage.cardioPoint = SerieCardio.points;
			window.sessionStorage.cardioTitre = SerieCardio.titre;
			window.sessionStorage.muscuTitre = SerieMuscu.titre;
		}
	}
};

let Serie = {
	save : (serieId, repetitionId) => {
		let serie = document.getElementById(serieId).value;
		let repetition = document.getElementById(repetitionId).value;
		let date = new Date();
		let points;

		if (serie == "pompes" || serie == "abdos" || serie == "jambes" || 
			serie == "lever_de_genou" || serie == "mountainclimber" || serie == "jumpingjack") {
			points = repetition * 2;
		} else if (serie == "tractions" || serie == "dips" || serie == "burpees") {
			points = repetition * 4;
		} else {
			return 0;
		}

		DataBase.ecrire({
			"points" : points,
			"date" : date.toDateString()
		});

		alert('Bravo ! Une nouvelle série effectuée.');

		Graphique.getData();	
	}
};

let DataBase = {
	lire : () => { return localStorage; },

	ecrire : (Serie) => {
		if (localStorage[Serie.date] != undefined) {
			localStorage[Serie.date] = parseInt(localStorage[Serie.date]) + parseInt(Serie.points);
		} else {
			localStorage[Serie.date] = Serie.points;
		}
	}
};

let Graphique = {
	getData : () => {
		let Data = DataBase.lire()
		let jours = [];
		let points = [];
		let dataForGraph;

		for (let jour in Data) {
			if (jour.split(' ').length > 2) {
				console.log(typeof jour);
				jours.push(jour);
				points.push(Data[jour]);
			}
		}

		Graphique.makeData(jours, points, dataForGraph);
	},

	makeData : (jours, points, dataForGraph) => {
		dataForGraph = {
			labels: jours,
			datasets: [{
				label: 'Points',
				backgroundColor: 'rgba(221, 138, 18, 0.5)',
				borderColor: '#dd8a12',
				borderWidth: 1,
				data: points
			}]
		};

		Graphique.makeGraph(dataForGraph);
	},

	makeGraph : (dataForGraph) => {
		var ctx = document.getElementById('graphique_canvas').getContext('2d');
		window.myBar = new Chart(ctx, {
			type: 'bar',
			data: dataForGraph,
			options: {
				responsive: true,
				legend: {
					position: 'top',
				},
				title: {
					display: true,
					text: 'Points par jours.'
				}
			}
		});
	}
};

let xhttp = new XMLHttpRequest();
xhttp.open("GET", "https://coachsportifvirtuel.pythonanywhere.com/", true);
xhttp.send();