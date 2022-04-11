import { createClass } from './helper.js';

export default {
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
    ],
  },
  PSAT: {
    image: '../image/PSAT_Schedule.jpg',
    hide: true,
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
      createClass('lunch', '12:12', '12:51'),
      createClass('5', '12:58', '13:54'),
    ],
    lunch_c: [
      createClass('4', '11:42', '12:21'),
      createClass('5a', '12:27', '12:51'),
      createClass('lunch', '12:51', '13:21'),
      createClass('5b', '13:27', '13:54'),
    ],
    lunch_d: [
      createClass('4', '11:42', '12:21'),
      createClass('5', '12:27', '13:24'),
      createClass('lunch', '13:24', '13:54'),
    ],

    after_lunch: [
      createClass('6', '14:00', '14:22'),
      createClass('7', '2:28', '14:50'),
    ],
  },
  final_dec_14: {
    date: new Date(2021, 11, 14),
    hide: true,
    before_lunch: [
      createClass('1st Final', '7:20', '9:20'),
      createClass('3', '9:26', '10:18'),
    ],

    lunch_a: [
      createClass('lunch', '10:18', '10:48'),
      createClass('4', '10:54', '11:24'),
      createClass('5', '11:30', '12:36'),
    ],
    lunch_b: [
      createClass('4', '10:24', '10:54'),
      createClass('lunch', '10:54', '11:24'),
      createClass('5', '11:30', '12:36'),
    ],
    lunch_c: [
      createClass('4', '10:24', '10:54'),
      createClass('5a', '11:00', '11:30'),
      createClass('lunch', '11:30', '12:00'),
      createClass('5b', '12:06', '12:36'),
    ],
    lunch_d: [
      createClass('4', '10:24', '10:54'),
      createClass('5', '11:00', '12:06'),
      createClass('lunch', '12:06', '12:36'),
    ],

    after_lunch: [
      createClass('6th Final', '12:42', '14:50'),
    ],
  },
  final_dec_15: {
    date: new Date(2021, 11, 15),
    hide: true,
    before_lunch: [
      createClass('2nd Final', '7:20', '9:20'),
      createClass('3', '9:26', '10:18'),
    ],

    lunch_a: [
      createClass('lunch', '10:18', '10:48'),
      createClass('4', '10:54', '11:24'),
      createClass('5', '11:30', '12:36'),
    ],
    lunch_b: [
      createClass('4', '10:24', '10:54'),
      createClass('lunch', '10:54', '11:24'),
      createClass('5', '11:30', '12:36'),
    ],
    lunch_c: [
      createClass('4', '10:24', '10:54'),
      createClass('5a', '11:00', '11:30'),
      createClass('lunch', '11:30', '12:00'),
      createClass('5b', '12:06', '12:36'),
    ],
    lunch_d: [
      createClass('4', '10:24', '10:54'),
      createClass('5', '11:00', '12:06'),
      createClass('lunch', '12:06', '12:36'),
    ],

    after_lunch: [
      createClass('7th Final', '12:42', '14:50'),
    ],
  },
  final_dec_16: {
    date: new Date(2021, 11, 16),
    hide: true,
    before_lunch: [
      createClass('3nd Final', '7:20', '9:20'),
      createClass('3', '9:26', '10:18'),
    ],

    lunch_a: [
      createClass('lunch', '10:18', '10:48'),
      createClass('4', '10:54', '11:24'),
      createClass('5', '11:30', '12:36'),
    ],
    lunch_b: [
      createClass('4', '10:24', '10:54'),
      createClass('lunch', '10:54', '11:24'),
      createClass('5', '11:30', '12:36'),
    ],
    lunch_c: [
      createClass('4', '10:24', '10:54'),
      createClass('5a', '11:00', '11:30'),
      createClass('lunch', '11:30', '12:00'),
      createClass('5b', '12:06', '12:36'),
    ],
    lunch_d: [
      createClass('4', '10:24', '10:54'),
      createClass('5', '11:00', '12:06'),
      createClass('lunch', '12:06', '12:36'),
    ],

    after_lunch: [
      createClass('5th Final', '12:42', '14:50'),
    ],
  },
  final_dec_17: {
    date: new Date(2021, 11, 17),
    hide: true,
    before_lunch: [
      createClass('4th Final', '7:20', '9:20'),
      createClass('3', '9:26', '10:18'),
    ],

    lunch_a: [
      createClass('lunch', '10:18', '10:48'),
      createClass('4', '10:54', '11:24'),
      createClass('5', '11:30', '12:36'),
    ],
    lunch_b: [
      createClass('4', '10:24', '10:54'),
      createClass('lunch', '10:54', '11:24'),
      createClass('5', '11:30', '12:36'),
    ],
    lunch_c: [
      createClass('4', '10:24', '10:54'),
      createClass('5a', '11:00', '11:30'),
      createClass('lunch', '11:30', '12:00'),
      createClass('5b', '12:06', '12:36'),
    ],
    lunch_d: [
      createClass('4', '10:24', '10:54'),
      createClass('5', '11:00', '12:06'),
      createClass('lunch', '12:06', '12:36'),
    ],

    after_lunch: [
      createClass('6', '12:42', '13:43'),
      createClass('7', '13:49', '14:50'),
    ],
  },
  alt_11_april: {
    date: new Date(2022, 3, 11),
    before_lunch: [
      createClass('1', '7:20', '8:12'),
      createClass('2', '8:18', '9:15'),
      createClass('3', '9:21', '10:13'),
    ],

    lunch_a: [
      createClass('lunch', '10:43', '11:13'),
      createClass('4', '11:19', '12:12'),
      createClass('5', '12:18', '13:24'),
    ],
    lunch_b: [
      createClass('4', '10:43', '11:42'),
      createClass('lunch', '11:42', '12:12'),
      createClass('5', '12:18', '13:24'),
    ],
    lunch_c: [
      createClass('4', '10:49', '11:42'),
      createClass('5a', '11:48', '12:18'),
      createClass('lunch', '12:18', '12:48'),
      createClass('5b', '12:54', '13:24'),
    ],
    lunch_d: [
      createClass('4', '10:49', '11:42'),
      createClass('5', '11:48', '12:54'),
      createClass('lunch', '12:54', '13:24'),
    ],
    after_lunch: [
      createClass('6', '13:30', '14:07'),
      createClass('7', '14:13', '14:50'),
    ],
  },
};
