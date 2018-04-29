/*
********************************************************************************
**
** Workouts
**
********************************************************************************
*/

/*
const  = {
	endurance: [
		[[, ''], ],
	],
	standard: [
		[[, ''], ],
	],
	strength: [
		[[, ''], ],
	]
};
*/

const APHRODITE = {
	endurance: [
		[[50, 'Sprawls'], [50, 'HH Squats'], [50, 'Crunches']],
		[[40, 'Sprawls'], [40, 'HH Squats'], [40, 'Crunches']],
		[[30, 'Sprawls'], [30, 'HH Squats'], [30, 'Crunches']],
		[[20, 'Sprawls'], [20, 'HH Squats'], [20, 'Crunches']],
		[[10, 'Sprawls'], [10, 'HH Squats'], [10, 'Crunches']]
	],
	standard: [
		[[50, 'Burpees'], [50, 'Squats'], [50, 'Situps']],
		[[40, 'Burpees'], [40, 'Squats'], [40, 'Situps']],
		[[30, 'Burpees'], [30, 'Squats'], [30, 'Situps']],
		[[20, 'Burpees'], [20, 'Squats'], [20, 'Situps']],
		[[10, 'Burpees'], [10, 'Squats'], [10, 'Situps']]
	],
	strength: [
		[[50, 'Burpee Squat Jumps'], [50, 'Pistols'], [50, 'Jacknives']],
		[[40, 'Burpee Squat Jumps'], [40, 'Pistols'], [40, 'Jacknives']],
		[[30, 'Burpee Squat Jumps'], [30, 'Pistols'], [30, 'Jacknives']],
		[[20, 'Burpee Squat Jumps'], [20, 'Pistols'], [20, 'Jacknives']],
		[[10, 'Burpee Squat Jumps'], [10, 'Pistols'], [10, 'Jacknives']]
	]
};

const APOLLON = {
	endurance: [
		[[25, 'Sprawls'], [1, '400m Run'], [50, 'HH Squats'], [1, '400m Run']],
		[[25, 'Sprawls'], [1, '400m Run'], [50, 'HH Squats'], [1, '400m Run']],
		[[25, 'Sprawls'], [1, '400m Run'], [50, 'HH Squats'], [1, '400m Run']]
	],
	standard: [
		[[25, 'Burpees'], [1, '400m Run'], [50, 'Squats'], [1, '400m Run']],
		[[25, 'Burpees'], [1, '400m Run'], [50, 'Squats'], [1, '400m Run']],
		[[25, 'Burpees'], [1, '400m Run'], [50, 'Squats'], [1, '400m Run']],
	],
	strength: [
		[[25, 'Burpee Squat Jumps'], [1, '400m Run'], [50, 'Pistols'], [1, '400m Run']],
		[[25, 'Burpee Squat Jumps'], [1, '400m Run'], [50, 'Pistols'], [1, '400m Run']],
		[[25, 'Burpee Squat Jumps'], [1, '400m Run'], [50, 'Pistols'], [1, '400m Run']]
	]
};

const ARES = {
	endurance: [
		[[7, 'Jumping Pullups'], [7, 'Crunches'], [2, '40m Run'], [1, '60s Rest']],
		[[7, 'Jumping Pullups'], [7, 'Crunches'], [2, '40m Run'], [1, '60s Rest']],
		[[7, 'Jumping Pullups'], [7, 'Crunches'], [2, '40m Run'], [1, '60s Rest']],
		[[7, 'Jumping Pullups'], [7, 'Crunches'], [2, '40m Run'], [1, '60s Rest']],
		[[7, 'Jumping Pullups'], [7, 'Crunches'], [2, '40m Run'], [1, '60s Rest']]
	],
	standard: [
		[[7, 'Pullups'], [7, 'Situps'], [2, '40m Run'], [1, '60s Rest']],
		[[7, 'Pullups'], [7, 'Situps'], [2, '40m Run'], [1, '60s Rest']],
		[[7, 'Pullups'], [7, 'Situps'], [2, '40m Run'], [1, '60s Rest']],
		[[7, 'Pullups'], [7, 'Situps'], [2, '40m Run'], [1, '60s Rest']],
		[[7, 'Pullups'], [7, 'Situps'], [2, '40m Run'], [1, '60s Rest']]
	],
	strength: [
		[[7, 'Muscleups'], [7, 'Jacknives'], [2, '40m Run'], [1, '60s Rest']],
		[[7, 'Muscleups'], [7, 'Jacknives'], [2, '40m Run'], [1, '60s Rest']],
		[[7, 'Muscleups'], [7, 'Jacknives'], [2, '40m Run'], [1, '60s Rest']],
		[[7, 'Muscleups'], [7, 'Jacknives'], [2, '40m Run'], [1, '60s Rest']],
		[[7, 'Muscleups'], [7, 'Jacknives'], [2, '40m Run'], [1, '60s Rest']]
	]
};

const ARTEMIS = {
	endurance: [
		[[50, 'Sprawls'], [50, 'Jumping Pullups'], [100, 'Knee Pushups'], [150, 'HH Squats'], [50, 'Sprawls']]
	],
	standard: [
		[[50, 'Burpees'], [50, 'Pullups'], [100, 'Pushups'], [150, 'Squats'], [50, 'Burpees']]
	],
	strength: [
		[[50, 'Burpee Squat Jumps'], [50, 'Muscleups'], [100, 'OH Pushups'], [150, 'Pistols'], [50, 'Burpee Squat Jumps']]
	]
};

const ATHENA = {
	endurance: [
		[[25, 'Mountain Climbers'], [25, 'Crunches'], [25, 'HH Squats'], [1, '25s Rest']],
		[[20, 'Mountain Climbers'], [20, 'Crunches'], [20, 'HH Squats'], [1, '20s Rest']],
		[[15, 'Mountain Climbers'], [15, 'Crunches'], [15, 'HH Squats'], [1, '15s Rest']],
		[[10, 'Mountain Climbers'], [10, 'Crunches'], [10, 'HH Squats'], [1, '10s Rest']],
		[[5, 'Mountain Climbers'], [5, 'Crunches'], [5, 'HH Squats'], [1, '5s Rest']]
	],
	standard: [
		[[25, 'Climbers'], [25, 'Situps'], [25, 'Squats'], [1, '25s Rest']],
		[[20, 'Climbers'], [20, 'Situps'], [20, 'Squats'], [1, '20s Rest']],
		[[15, 'Climbers'], [15, 'Situps'], [15, 'Squats'], [1, '15s Rest']],
		[[10, 'Climbers'], [10, 'Situps'], [10, 'Squats'], [1, '10s Rest']],
		[[5, 'Climbers'], [5, 'Situps'], [5, 'Squats'], [1, '5s Rest']]
	],
	strength: [
		[[25, 'Froggers'], [25, 'Jacknives'], [25, 'Pistols'], [1, '25s Rest']],
		[[20, 'Froggers'], [20, 'Jacknives'], [20, 'Pistols'], [1, '20s Rest']],
		[[15, 'Froggers'], [15, 'Jacknives'], [15, 'Pistols'], [1, '15s Rest']],
		[[10, 'Froggers'], [10, 'Jacknives'], [10, 'Pistols'], [1, '10s Rest']],
		[[5, 'Froggers'], [5, 'Jacknives'], [5, 'Pistols'], [1, '5s Rest']]
	]
};

const ATLAS = {
	endurance: [
		[[1, '2km Run'], [50, 'HH Squats'], [50, 'Sprawls'], [50, 'Mountain Climbers'], [50, 'HH Leg Lever'], [100, 'High Knees']]
	],
	standard: [
		[[1, '2km Run'], [50, 'Squats'], [50, 'Burpees'], [50, 'Climbers'], [50, 'Straight Leg Lever'], [100, 'Jumps']]
	],
	strength: [
		[[1, '2km Run'], [50, 'Pistols'], [50, 'Burpee Squat Jumps'], [50, 'Froggers'], [50, 'Toes To Bar'], [100, 'High Jumps']]
	]
};

const DIONE = {
	endurance: [
		[[75, 'Jumping Jacks'], [25, 'Sprawls'], [50, 'HH Leg Lever'], [75, 'Jumping Jacks'], [50, 'Crunches'], [25, 'Sprawls']],
		[[75, 'Jumping Jacks'], [25, 'Sprawls'], [50, 'HH Leg Lever'], [75, 'Jumping Jacks'], [50, 'Crunches'], [25, 'Sprawls']],
		[[75, 'Jumping Jacks'], [25, 'Sprawls'], [50, 'HH Leg Lever'], [75, 'Jumping Jacks'], [50, 'Crunches'], [25, 'Sprawls']]
	],
	standard: [
		[[75, 'Jumping Jacks'], [25, 'Burpees'], [50, 'Straight Leg Lever'], [75, 'Jumping Jacks'], [50, 'Situps'], [25, 'Burpees']],
		[[75, 'Jumping Jacks'], [25, 'Burpees'], [50, 'Straight Leg Lever'], [75, 'Jumping Jacks'], [50, 'Situps'], [25, 'Burpees']],
		[[75, 'Jumping Jacks'], [25, 'Burpees'], [50, 'Straight Leg Lever'], [75, 'Jumping Jacks'], [50, 'Situps'], [25, 'Burpees']]
	],
	strength: [
		[[75, 'Jumping Jacks'], [25, 'Burpee Squat Jumps'], [50, 'Toes To Bar'], [75, 'Jumping Jacks'], [50, 'Jacknives'], [25, 'Burpee Squat Jumps']],
		[[75, 'Jumping Jacks'], [25, 'Burpee Squat Jumps'], [50, 'Toes To Bar'], [75, 'Jumping Jacks'], [50, 'Jacknives'], [25, 'Burpee Squat Jumps']],
		[[75, 'Jumping Jacks'], [25, 'Burpee Squat Jumps'], [50, 'Toes To Bar'], [75, 'Jumping Jacks'], [50, 'Jacknives'], [25, 'Burpee Squat Jumps']]
	]
};

const GAIA = {
	endurance: [
		[[40, 'Jumping Jacks'], [30, 'High Knees'], [20, 'Mountain Climbers'], [10, 'HH Standups']],
		[[40, 'Jumping Jacks'], [30, 'High Knees'], [20, 'Mountain Climbers'], [10, 'HH Standups']],
		[[40, 'Jumping Jacks'], [30, 'High Knees'], [20, 'Mountain Climbers'], [10, 'HH Standups']],
		[[40, 'Jumping Jacks'], [30, 'High Knees'], [20, 'Mountain Climbers'], [10, 'HH Standups']],
		[[40, 'Jumping Jacks'], [30, 'High Knees'], [20, 'Mountain Climbers'], [10, 'HH Standups']],
		[[40, 'Jumping Jacks'], [30, 'High Knees'], [20, 'Mountain Climbers'], [10, 'HH Standups']],
		[[40, 'Jumping Jacks'], [30, 'High Knees'], [20, 'Mountain Climbers'], [10, 'HH Standups']],
		[[40, 'Jumping Jacks'], [30, 'High Knees'], [20, 'Mountain Climbers'], [10, 'HH Standups']],
		[[40, 'Jumping Jacks'], [30, 'High Knees'], [20, 'Mountain Climbers'], [10, 'HH Standups']],
		[[40, 'Jumping Jacks'], [30, 'High Knees'], [20, 'Mountain Climbers'], [10, 'HH Standups']]
	],
	standard: [
		[[40, 'Jumping Jacks'], [30, 'Jumps'], [20, 'Climbers'], [10, 'Standups']],
		[[40, 'Jumping Jacks'], [30, 'Jumps'], [20, 'Climbers'], [10, 'Standups']],
		[[40, 'Jumping Jacks'], [30, 'Jumps'], [20, 'Climbers'], [10, 'Standups']],
		[[40, 'Jumping Jacks'], [30, 'Jumps'], [20, 'Climbers'], [10, 'Standups']],
		[[40, 'Jumping Jacks'], [30, 'Jumps'], [20, 'Climbers'], [10, 'Standups']],
		[[40, 'Jumping Jacks'], [30, 'Jumps'], [20, 'Climbers'], [10, 'Standups']],
		[[40, 'Jumping Jacks'], [30, 'Jumps'], [20, 'Climbers'], [10, 'Standups']],
		[[40, 'Jumping Jacks'], [30, 'Jumps'], [20, 'Climbers'], [10, 'Standups']],
		[[40, 'Jumping Jacks'], [30, 'Jumps'], [20, 'Climbers'], [10, 'Standups']],
		[[40, 'Jumping Jacks'], [30, 'Jumps'], [20, 'Climbers'], [10, 'Standups']]
	],
	strength: [
		[[40, 'Jumping Jacks'], [30, 'High Jumps'], [20, 'Froggers'], [10, 'Standup Jumps']],
		[[40, 'Jumping Jacks'], [30, 'High Jumps'], [20, 'Froggers'], [10, 'Standup Jumps']],
		[[40, 'Jumping Jacks'], [30, 'High Jumps'], [20, 'Froggers'], [10, 'Standup Jumps']],
		[[40, 'Jumping Jacks'], [30, 'High Jumps'], [20, 'Froggers'], [10, 'Standup Jumps']],
		[[40, 'Jumping Jacks'], [30, 'High Jumps'], [20, 'Froggers'], [10, 'Standup Jumps']],
		[[40, 'Jumping Jacks'], [30, 'High Jumps'], [20, 'Froggers'], [10, 'Standup Jumps']],
		[[40, 'Jumping Jacks'], [30, 'High Jumps'], [20, 'Froggers'], [10, 'Standup Jumps']],
		[[40, 'Jumping Jacks'], [30, 'High Jumps'], [20, 'Froggers'], [10, 'Standup Jumps']],
		[[40, 'Jumping Jacks'], [30, 'High Jumps'], [20, 'Froggers'], [10, 'Standup Jumps']],
		[[40, 'Jumping Jacks'], [30, 'High Jumps'], [20, 'Froggers'], [10, 'Standup Jumps']]
	]
};

const HADES = {
	endurance: [
		[[25, 'Sprawls'], [15, 'Jumping Pullups'], [15, 'Knee Pushups'], [25, 'Sprawls'], [2, '40m Run']],
		[[25, 'Sprawls'], [15, 'Jumping Pullups'], [15, 'Knee Pushups'], [25, 'Sprawls'], [2, '40m Run']],
		[[25, 'Sprawls'], [15, 'Jumping Pullups'], [15, 'Knee Pushups'], [25, 'Sprawls'], [2, '40m Run']]
	],
	standard: [
		[[25, 'Burpees'], [15, 'Pullups'], [15, 'Pushups'], [25, 'Burpees'], [2, '40m Run']],
		[[25, 'Burpees'], [15, 'Pullups'], [15, 'Pushups'], [25, 'Burpees'], [2, '40m Run']],
		[[25, 'Burpees'], [15, 'Pullups'], [15, 'Pushups'], [25, 'Burpees'], [2, '40m Run']]
	],
	strength: [
		[[25, 'Burpee Squat Jumps'], [15, 'Muscleups'], [15, 'OH Pushups'], [25, 'Burpee Squat Jumps'], [2, '40m Run']],
		[[25, 'Burpee Squat Jumps'], [15, 'Muscleups'], [15, 'OH Pushups'], [25, 'Burpee Squat Jumps'], [2, '40m Run']],
		[[25, 'Burpee Squat Jumps'], [15, 'Muscleups'], [15, 'OH Pushups'], [25, 'Burpee Squat Jumps'], [2, '40m Run']]
	]
};

const HELIOS = {
	endurance: [
		[[100, 'Sprawls'], [125, 'HH Lunges'], [150, 'Mountain Climbers'], [125, 'Crunches'], [150, 'Mountain Climbers'], [125, 'HH Lunges'], [100, 'Sprawls']]
	],
	standard: [
		[[100, 'Burpees'], [125, 'Lunges'], [150, 'Climbers'], [125, 'Situps'], [150, 'Climbers'], [125, 'Lunges'], [100, 'Burpees']]
	],
	strength: [
		[[100, 'Burpee Squat Jumps'], [125, 'Split Lunges'], [150, 'Froggers'], [125, 'Jacknives'], [150, 'Froggers'], [125, 'Split Lunges'], [100, 'Burpee Squat Jumps']]
	]
};

const HERA = {
	endurance: [
		[[40, 'High Knees'], [1, '60s Rest'], [1, '400m Run'], [1, '60s Rest']],
		[[40, 'High Knees'], [1, '60s Rest'], [1, '400m Run'], [1, '60s Rest']],
		[[40, 'High Knees'], [1, '60s Rest'], [1, '400m Run'], [1, '60s Rest']],
		[[40, 'High Knees'], [1, '60s Rest'], [1, '400m Run'], [1, '60s Rest']],
		[[40, 'High Knees'], [1, '60s Rest'], [1, '400m Run'], [1, '60s Rest']]
	],
	standard: [
		[[40, 'Jumps'], [1, '60s Rest'], [1, '400m Run'], [1, '60s Rest']],
		[[40, 'Jumps'], [1, '60s Rest'], [1, '400m Run'], [1, '60s Rest']],
		[[40, 'Jumps'], [1, '60s Rest'], [1, '400m Run'], [1, '60s Rest']],
		[[40, 'Jumps'], [1, '60s Rest'], [1, '400m Run'], [1, '60s Rest']],
		[[40, 'Jumps'], [1, '60s Rest'], [1, '400m Run'], [1, '60s Rest']]
	],
	strength: [
		[[40, 'High Jumps'], [1, '60s Rest'], [1, '400m Run'], [1, '60s Rest']],
		[[40, 'High Jumps'], [1, '60s Rest'], [1, '400m Run'], [1, '60s Rest']],
		[[40, 'High Jumps'], [1, '60s Rest'], [1, '400m Run'], [1, '60s Rest']],
		[[40, 'High Jumps'], [1, '60s Rest'], [1, '400m Run'], [1, '60s Rest']],
		[[40, 'High Jumps'], [1, '60s Rest'], [1, '400m Run'], [1, '60s Rest']]
	]
};

const HERMES = {
	endurance: [
		[[1, '40m Run'], [10, 'Knee Pushups'], [1, '30s Rest'], [1, '40m Run'], [10, 'Knee Pushups'], [1, '30s Rest'], [1, '40m Run'], [1, '60s Rest']],
		[[1, '40m Run'], [10, 'Knee Pushups'], [1, '30s Rest'], [1, '40m Run'], [10, 'Knee Pushups'], [1, '30s Rest'], [1, '40m Run'], [1, '60s Rest']],
		[[1, '40m Run'], [10, 'Knee Pushups'], [1, '30s Rest'], [1, '40m Run'], [10, 'Knee Pushups'], [1, '30s Rest'], [1, '40m Run'], [1, '60s Rest']],
		[[1, '40m Run'], [10, 'Knee Pushups'], [1, '30s Rest'], [1, '40m Run'], [10, 'Knee Pushups'], [1, '30s Rest'], [1, '40m Run'], [1, '60s Rest']]
	],
	standard: [
		[[1, '40m Run'], [10, 'Pushups'], [1, '30s Rest'], [1, '40m Run'], [10, 'Pushups'], [1, '30s Rest'], [1, '40m Run'], [1, '60s Rest']],
		[[1, '40m Run'], [10, 'Pushups'], [1, '30s Rest'], [1, '40m Run'], [10, 'Pushups'], [1, '30s Rest'], [1, '40m Run'], [1, '60s Rest']],
		[[1, '40m Run'], [10, 'Pushups'], [1, '30s Rest'], [1, '40m Run'], [10, 'Pushups'], [1, '30s Rest'], [1, '40m Run'], [1, '60s Rest']],
		[[1, '40m Run'], [10, 'Pushups'], [1, '30s Rest'], [1, '40m Run'], [10, 'Pushups'], [1, '30s Rest'], [1, '40m Run'], [1, '60s Rest']]
	],
	strength: [
		[[1, '40m Run'], [10, 'OH Pushups'], [1, '30s Rest'], [1, '40m Run'], [10, 'OH Pushups'], [1, '30s Rest'], [1, '40m Run'], [1, '60s Rest']],
		[[1, '40m Run'], [10, 'OH Pushups'], [1, '30s Rest'], [1, '40m Run'], [10, 'OH Pushups'], [1, '30s Rest'], [1, '40m Run'], [1, '60s Rest']],
		[[1, '40m Run'], [10, 'OH Pushups'], [1, '30s Rest'], [1, '40m Run'], [10, 'OH Pushups'], [1, '30s Rest'], [1, '40m Run'], [1, '60s Rest']],
		[[1, '40m Run'], [10, 'OH Pushups'], [1, '30s Rest'], [1, '40m Run'], [10, 'OH Pushups'], [1, '30s Rest'], [1, '40m Run'], [1, '60s Rest']]
	]
};

const HYPERION = {
	endurance: [
		[[5, 'Pikes'], [25, 'HH Squats'], [5, 'Pikes'], [25, 'High Knees'], [1, '60s Rest']],
		[[5, 'Pikes'], [25, 'HH Squats'], [5, 'Pikes'], [25, 'High Knees'], [1, '60s Rest']],
		[[5, 'Pikes'], [25, 'HH Squats'], [5, 'Pikes'], [25, 'High Knees'], [1, '60s Rest']],
		[[5, 'Pikes'], [25, 'HH Squats'], [5, 'Pikes'], [25, 'High Knees'], [1, '60s Rest']],
		[[5, 'Pikes'], [25, 'HH Squats'], [5, 'Pikes'], [25, 'High Knees'], [1, '60s Rest']]
	],
	standard: [
		[[5, 'Kiping HS Pushups'], [25, 'Squats'], [5, 'Kiping HS Pushups'], [25, 'Jumps'], [1, '60s Rest']],
		[[5, 'Kiping HS Pushups'], [25, 'Squats'], [5, 'Kiping HS Pushups'], [25, 'Jumps'], [1, '60s Rest']],
		[[5, 'Kiping HS Pushups'], [25, 'Squats'], [5, 'Kiping HS Pushups'], [25, 'Jumps'], [1, '60s Rest']],
		[[5, 'Kiping HS Pushups'], [25, 'Squats'], [5, 'Kiping HS Pushups'], [25, 'Jumps'], [1, '60s Rest']],
		[[5, 'Kiping HS Pushups'], [25, 'Squats'], [5, 'Kiping HS Pushups'], [25, 'Jumps'], [1, '60s Rest']]
	],
	strength: [
		[[5, 'Strict HS Pushups'], [25, 'Pistols'], [5, 'Strict HS Pushups'], [25, 'High Jumps'], [1, '60s Rest']],
		[[5, 'Strict HS Pushups'], [25, 'Pistols'], [5, 'Strict HS Pushups'], [25, 'High Jumps'], [1, '60s Rest']],
		[[5, 'Strict HS Pushups'], [25, 'Pistols'], [5, 'Strict HS Pushups'], [25, 'High Jumps'], [1, '60s Rest']],
		[[5, 'Strict HS Pushups'], [25, 'Pistols'], [5, 'Strict HS Pushups'], [25, 'High Jumps'], [1, '60s Rest']],
		[[5, 'Strict HS Pushups'], [25, 'Pistols'], [5, 'Strict HS Pushups'], [25, 'High Jumps'], [1, '60s Rest']]
	]
};

const IRIS = {
	endurance: [
		[[1, '1km Run']],
		[[100, 'Jumping Jacks'], [100, 'Mountain Climbers']],
		[[100, 'Jumping Jacks'], [100, 'Mountain Climbers']],
		[[100, 'Jumping Jacks'], [100, 'Mountain Climbers']],
		[[100, 'Jumping Jacks'], [100, 'Mountain Climbers']],
		[[100, 'Jumping Jacks'], [100, 'Mountain Climbers']],
		[[1, '1km Run']]
	],
	standard: [
		[[1, '1km Run']],
		[[100, 'Jumping Jacks'], [100, 'Climbers']],
		[[100, 'Jumping Jacks'], [100, 'Climbers']],
		[[100, 'Jumping Jacks'], [100, 'Climbers']],
		[[100, 'Jumping Jacks'], [100, 'Climbers']],
		[[100, 'Jumping Jacks'], [100, 'Climbers']],
		[[1, '1km Run']]
	],
	strength: [
		[[1, '1km Run']],
		[[100, 'Jumping Jacks'], [100, 'Froggers']],
		[[100, 'Jumping Jacks'], [100, 'Froggers']],
		[[100, 'Jumping Jacks'], [100, 'Froggers']],
		[[100, 'Jumping Jacks'], [100, 'Froggers']],
		[[100, 'Jumping Jacks'], [100, 'Froggers']],
		[[1, '1km Run']]
	]
};
