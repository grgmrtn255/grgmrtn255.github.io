let json = `
{
	"muscu" : [
		{
			"titre" : "traction",
			"description" : "Faites 40 tractions (autant de séries que vous le souhaitez).",
			"points" : 200
		},

		{
			"titre" : "deeps",
			"description" : "Faites 40 deeps pour avoir des pecs énorme !",
			"points" : 200
		},

		{
			"titre" : "pompes",
			"description" : "Faites 100 pompes pour être beau gosse sur la plage",
			"points" : 250
		},

		{
			"titre" : "jambes",
			"description" : "Faites 100 fentes sur chaques jambes pour être énorme et sec.",
			"points" : 250
		},

		{
			"titre" : "squats",
			"description" : "Faites 100 squats pour avoir des fessiers d enfer !",
			"points" : 250
		}
	],
	
	"cardio" : [
		{
			"titre" : "jumping jack",
			"description" : "Si vous faites 300 jumping jack dans les 24 prochaines heures...",
			"points" : 350
		},

		{
			"titre" : "mountainclimbers",
			"description" : "Pensez à vos abdos ! 300 mountainclimbers pour de belles tablettes !",
			"points" : 350
		},

		{
			"titre" : "burppees",
			"description" : "Rien de mieux que des bonnes burppees, 100 burppees semble être un bon défi.",
			"points" : 500
		},

		{
			"titre" : "lever de genoux",
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

let Index = {
	changePage : (idInput) => {
		if (document.getElementById(idInput).value) {
			localStorage.username = document.getElementById(idInput).value;
			window.location.replace("./defiSportif.html");
		} else {
			alert('Désolé les pseudos ne servent à rien et pourtant...\nIls sont obligatoire.')
		}
	},
};

let Defi = {
	changeDefi : (categorie, idParagraphe) => {
		localStorage.categorie = categorie;
		if (categorie == "muscu") {
			document.getElementById(idParagraphe).innerHTML = localStorage.muscuDefi;
		} else if (categorie == "cardio") {
			document.getElementById(idParagraphe).innerHTML = localStorage.cardioDefi;
		}
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

	placePseudo : () => {
		if (localStorage.username) {
			document.getElementById('pseudo').innerHTML = "Bienvenu " + localStorage.username + " !";
			localStorage.categorie = "";
		} else {
			window.location.replace('./index.html');
			alert('Veuillez entrer un pseudo.');
		}
	},

	choisiDefi : () => {
		json = JSON.parse(json);
		SerieMuscu = json.muscu[Math.floor(Math.random() * json.muscu.length)];
		SerieCardio = json.cardio[Math.floor(Math.random() * json.cardio.length)];
		localStorage.muscuDefi = SerieMuscu.description;
		localStorage.cardioDefi = SerieCardio.description;
		localStorage.muscuPoint = SerieMuscu.points;
		localStorage.cardioPoint = SerieCardio.points;
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
		} else if (serie == "tractions" || serie == "deeps" || serie == "burppees") {
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
	lire : () => {return localStorage;},
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
			console.log(jour);
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
				backgroundColor: 'rgba(0, 0, 255, 0.5)',
				borderColor: 'blue',
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
