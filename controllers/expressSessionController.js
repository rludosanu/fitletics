const Exercises = {
	Endurance: {
		JumpingJacks: {
			id: 0,
			name: 'Jumping Jacks',
			body: ['Legs'],
			points: 0.20
		},
		Sprawls: {
			id: 0,
			name: 'Sprawls',
			body: ['Arms', 'Abdominals'],
			points: 0.40
		},
		HHLegLever: {
			id: 0,
			name: 'HH Leg Lever',
			body: ['Abdominals'],
			points: 0.30
		},
		Crunches: {
			id: 0,
			name: 'Crunches',
			body: ['Abdominals'],
			points: 0.40
		}
	},
	Standard: {

	},
	Strength: {

	}
}

const Workout = {
	Attila: [
		[50, Exercises.Sprawls.id],
		[15, Exercises.Crunches.id]
	]
}
