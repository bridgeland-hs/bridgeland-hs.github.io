const schedules = {
	regular: {
		before_lunch: [
			createClass('1', '7:20', '8:12'),
			createClass('2', '8:18', '9:15'),
			createClass('3', '9:21', '10:13'),
		],

		lunch_a: [
			createClass('lunch', '10:13', '10:43'),
			createClass('4', '10:49', '11:42'),
			createClass('5', '11:48', '12:54'),
		],
		lunch_b: [
			createClass('4', '10:19', '11:12'),
			createClass('lunch', '11:12', '11:42'),
			createClass('5', '11:48', '12:54'),
		],
		lunch_c: [
			createClass('4', '10:19', '11:12'),
			createClass('5a', '11:18', '11:48'),
			createClass('lunch', '11:48', '12:18'),
			createClass('5b', '12:24', '12:54'),
		],
		lunch_d: [
			createClass('4', '10:19', '11:12'),
			createClass('5', '11:18', '12:24'),
			createClass('lunch', '12:24', '12:54'),
		],

		after_lunch: [
			createClass('6', '13:00', '13:52'),
			createClass('7', '13:58', '14:50'),
		],
	},
	advisory: {
		before_lunch: [
			createClass('1', '7:20', '8:06'),
			createClass('2', '8:12', '9:03'),
			createClass('Advisory', '9:03', '9:33'),
			createClass('3', '9:39', '10:25'),
		],

		lunch_a: [
			createClass('lunch', '10:25', '10:55'),
			createClass('4', '11:01', '11:50'),
			createClass('5', '11:56', '12:59'),
		],
		lunch_b: [
			createClass('4', '10:31', '11:19'),
			createClass('lunch', '11:19', '11:49'),
			createClass('5', '11:55', '12:59'),
		],
		lunch_c: [
			createClass('4', '10:31', '11:19'),
			createClass('5a', '11:25', '11:56'),
			createClass('lunch', '11:56', '12:26'),
			createClass('5b', '12:32', '12:59'),
		],
		lunch_d: [
			createClass('4', '10:31', '11:19'),
			createClass('5', '11:25', '12:29'),
			createClass('lunch', '12:29', '12:59'),
		],

		after_lunch: [
			createClass('6', '13:05', '13:54'),
			createClass('7', '14:00', '14:50'),
		],
	},
	pep_rally: {
		before_lunch: [
			createClass('1', '7:20', '8:02'),
			createClass('2', '8:08', '8:50'),
			createClass('3', '8:56', '9:38'),
		],

		lunch_a: [
			createClass('lunch', '9:38', '10:08'),
			createClass('4', '10:14', '11:08'),
			createClass('5', '11:14', '12:08'),
		],
		lunch_b: [
			createClass('4', '9:44', '10:30'),
			createClass('lunch', '10:30', '11:00'),
			createClass('5', '11:06', '12:08'),
		],
		lunch_c: [
			createClass('4', '9:44', '10:30'),
			createClass('5a', '10:36', '11:02'),
			createClass('lunch', '11:02', '12:32'),
			createClass('5b', '12:38', '12:08'),
		],
		lunch_d: [
			createClass('4', '9:44', '10:30'),
			createClass('5', '10:36', '11:38'),
			createClass('lunch', '11:38', '12:08'),
		],

		after_lunch: [
			createClass('6', '12:14', '12:59'),
			createClass('7', '13:05', '14:50'),
		]
	},
    PSAT: {
		before_lunch: [
			createClass('1', '7:20', '8:23'),
			createClass('2', '8:29', '10:00'),
			createClass('3', '10:06', '11:36'),
		],

		lunch_a: [
			createClass('lunch', '11:36', '12:06'),
			createClass('4', '12:12', '12:42'),
			createClass('5', '12:48', '13:44'),
		],
		lunch_b: [
			createClass('4', '11:42', '12:12'),
			createClass('lunch', '12:12', '12:42'),
			createClass('5', '12:48', '13:44'),
		],
		lunch_c: [
			createClass('4', '11:42', '12:12'),
			createClass('5a', '12:18', '12:48'),
			createClass('lunch', '12:48', '13:18'),
			createClass('5b', '13:24', '13:44'),
		],
		lunch_d: [
			createClass('4', '11:42', '12:12'),
			createClass('5', '12:18', '13:14'),
			createClass('lunch', '13:22', '13:44'),
		],

		after_lunch: [
			createClass('6', '13:50', '14:17'),
			createClass('7', '2:23', '14:50'),
		]
    }
};