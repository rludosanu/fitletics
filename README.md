# fitletics

**fitletics** is a personnal bodyweight training web-app based on the famous Freeletics app.

## Todo

- [ ] Build up pages design
	- [ ] Signin / Signup
	- [ ] Index screen
		- [ ] Pre-defined workouts
		- [ ] Express sessions
		- [ ] Exercise sets
		- [ ] Bottom bar
	- [ ] Pre-defined workouts
		- [ ] List of all of the workouts
		- [ ] Workout (started)
		- [ ] Workout feedback
	- [ ] Express sessions
	- [ ] Profil
	- [ ] Stat
- [ ] Define API routes
- [ ] Create models for database
	- [ ] User
	- [ ] Measurements
	- [ ] Exercises
	- [ ] Pre-defined workouts
	- [ ] Express sessions

## Models

- [ ] User
	- id
	- email
	- password
	- name
	- birthday
- [ ] Measurements
	- id
	- userId
	- date
	- bodyWeight
	- leftArm
	- rightArm
	- leftLeg
	- rightLeg
- [ ] Exercises
	- id
	- name
	- type (enum: endurance, standard, force)
	- category (enum: planks, squats, crunches, situps, pushups, pullups)
	- points
	- bodyPart

## Architecture

- [ ] Signin / Signup
- [ ] Index screen
	- [ ] Pre-defined workouts
	- [ ] Express sessions
	- [ ] Exercise sets
	- [ ] Bottom bar
		- [ ] Workouts
		- [ ] Profil
		- [ ] Stats
- [ ] Pre-defined workouts
	- [ ] List of all of the workouts
		- [ ] Workout detail
			- [ ] Endurance
			- [ ] Standard
			- [ ] Force
		- [ ] Detail of each round
		- [ ] Start button
	- [ ] Workout (started)
		- [ ] Running chronometer
		- [ ] Current exercise set
		- [ ] Next exercise set
		- [ ] Percentage of the training done (progress bar)
		- [ ] Next button
		- [ ] When done : Feedback button
	- [ ] Workout feedback
		- [ ] Scales
			- [ ] How tired do you feel ?
			- [ ] How good did you do each exercice ?
		- [ ] Annotation
- [ ] Express sessions
	- [ ] How much time ?
	- [ ] Parts of the body not to use
	- [ ] Automatic name generator
	- [ ] Start button
- [ ] Exercise sets
	- [ ] Basics
	- [ ] Unlocked by level
	- [ ] Add new
		- [ ] Name
		- [ ] Type (Endurance / Standard / Force)
		- [ ] Points by set (x10)
		- [ ] Part of the body
		- [ ] Exercises to be mastered before
- [ ] Profil
	- [ ] Update email / password
	- [ ] Update name / birth date
	- [ ] Weekly measurements
		- [ ] Body weight
		- [ ] Arms / Legs / Belly measurements
- [ ] Stats
	- [ ] Global
		- [ ] Total points
		- [ ] How many reps of each exercises
		- [ ] Pre-defined workouts list
		- [ ] Express sessions list
	- [ ] Weekly
		- [ ] Total points
		- [ ] Total time
		- [ ] Measurements
