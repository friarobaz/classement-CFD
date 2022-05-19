<script>
	import {fetchCFD} from './lib/firebase'
	let input, selectedPilot
	let filtered = []
	const SHORTCUTS = ['BAPTISTE MARCHAND', 'JULES MARCHAND']

	

	const getPilotsFromCFD = async ()=>{
		const response = await fetchCFD()
		const data = response.data
		const dataArray = data.split("\n")
		const getReleventLines = (searchString) => {
			return dataArray.filter((x) => x.includes(searchString))
		}
		const getName = (pilotLine) => {
			return pilotLine.split('</td>')[1].split('</a>')[0].split('">')[1]
		}
		const getRank = (pilotLine) =>{
			return parseInt(pilotLine.split('</td>')[0].split('<td>')[1])
		}
		const getPoints = (pilotLine) =>{
			return parseInt(pilotLine.split('</td>')[4].split('<td>')[1])
		}

		const getFlights = (pilotLine) => {
			const rawFlights = pilotLine.split('</td>')[3].split('</a>')
			rawFlights.pop()
			const flights = rawFlights.map(x=>{
				const array = x.split('km')[0].split('de ')
				return{
				km:parseInt(array[array.length-1]),
				points: parseInt(x.split('">')[1].split(" ")[1]),
				type: x.split('">')[1].split(" ")[0],
				date: x.split('km le ')[1].split('">')[0],
				valid: !x.includes('text-decoration'),
			}})
			return flights
			
		}
  		const str = "Les 3 meilleurs vols de chaque pilote comptent"
		const nbOfPilots = parseInt(getReleventLines(str)[0].split(' pilotes')[0].split('de ')[1])
		const allPilots = data.split('<tbody>')[1].split('</tbody>')[0].split('</tr>')
		allPilots.pop()
		if(nbOfPilots !== allPilots.length) throw "Le nombre de pilote est erroné"
		console.log(nbOfPilots)
		const pilots = allPilots.map((x)=> {return {
				name: getName(x),
				flights: getFlights(x),
				rank: getRank(x),
				points: getPoints(x)
			}}
		)
		const rank = Math.floor(nbOfPilots/4)
		const lastPilot = pilots.filter(x=>x.rank==rank)[0]
		return {pilots, rank, points:lastPilot.points}
	}
	const obj = getPilotsFromCFD()

	const update = (pilots)=>{
		selectedPilot = null
		filtered = pilots.filter(x=>x.name.includes(input.toUpperCase()))
	}

	const getFlightPointsMissing = (pilot, expectedPoints)=>{
		if(pilot.flights.length<3) return expectedPoints-pilot.points
		const flightPoints = pilot.flights.map(x=>x.points)
		const min = Math.min(...flightPoints)
		const pointsWithoutWorseFlight = pilot.points - min
		return expectedPoints - pointsWithoutWorseFlight
	}

</script>

<main>
	
	{#await obj}
		Merci de patienter...
	{:then {pilots, rank, points}} 
		<h4>Il y a {pilots.length} pilotes inscrits pour cette saison</h4>
		<h4>Il faut être {rank}ème avec {points} points (par exemple: 3 vols de {Math.ceil(points/3)} points)</h4>
		<h1>Choisir un pilote</h1>
		<input type="text" placeholder="Nom du pilote" bind:value={input} on:input={()=>update(pilots)}>
		
			<ul>
				{#if !input || selectedPilot}	
					{#each pilots.filter(x=>SHORTCUTS.includes(x.name)) as pilot}
						<li>
							<button on:click={()=>selectedPilot = pilot}>
								{pilot.name}
							</button>
						</li>
					{/each}
				{:else}
					{#each filtered as pilot}
						<li>
							<button on:click={()=>selectedPilot = pilot}>
								{pilot.name}
							</button>
						</li>
					{/each}
				{/if}
			</ul>
	
			
				{#if selectedPilot}
				
					<div class={selectedPilot.rank<=rank?'success':'fail'}>
						<h1>{selectedPilot.name}</h1>
						<h3>{selectedPilot.rank}ème ({selectedPilot.points} points)</h3>
						{#if points-selectedPilot.points > 0}
							<div style='color:red'>Il manque {points-selectedPilot.points} points.</div>
							<div style='color:red'>Il faut un vol de {getFlightPointsMissing(selectedPilot, points)} points pour y arriver.</div>
						{/if}
						<h4>Vols :</h4>
						<ul>
							{#each selectedPilot.flights as flight}
							<li class={flight.valid?'':'invalid'}>{flight.date} {flight.km}km {flight.points} points ({flight.type})</li>
							{/each}
						</ul>
					</div>
				
				{/if}
	{/await}

</main>

<style>
	li{
		list-style: none;
	}
	ul{
		padding: 0;
	}
	button{
		cursor: pointer;
	}
	.invalid{
		color:red;
		display: none;
	}
	.success{
		background-color: rgba(172, 255, 47, 0.488);
		padding: 20px;
	}

	.fail{
		background-color: rgba(255, 0, 0, 0.2);
		padding: 20px;
	}
	
</style>