-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-04-2022 a las 21:30:47
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 7.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `inventario_v3`
--

DELIMITER $$
--
-- Funciones
--
CREATE DEFINER=`root`@`localhost` FUNCTION `FIRST_DAY` (`day` DATE) RETURNS DATE BEGIN
  RETURN ADDDATE(LAST_DAY(SUBDATE(day, INTERVAL 1 MONTH)), 1);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bills`
--

CREATE TABLE `bills` (
  `idBills` int(11) NOT NULL,
  `price` varchar(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `fk_idTurn` int(11) NOT NULL,
  `fk_idBillsDetails` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `bills`
--

INSERT INTO `bills` (`idBills`, `price`, `date`, `time`, `fk_idTurn`, `fk_idBillsDetails`) VALUES
(2, '6500', '2021-06-03', '12:08:15', 7, 2),
(21, '5000', '2021-06-04', '11:48:15', 9, 1),
(22, '3500', '2021-06-04', '11:50:39', 9, 1),
(23, '3500', '2021-06-04', '11:52:11', 9, 3),
(24, '6500', '2021-06-04', '11:52:17', 9, 4),
(25, '95000', '2021-06-04', '11:52:24', 9, 5),
(26, '3200', '2021-06-04', '11:52:31', 9, 4),
(27, '5870', '2021-06-04', '11:52:36', 9, 5),
(28, '5480', '2021-06-04', '11:52:42', 9, 3),
(29, '6800', '2021-06-04', '11:52:49', 9, 5),
(30, '64694', '2021-06-04', '11:52:55', 9, 4),
(31, '94994', '2021-06-04', '11:53:00', 9, 5),
(32, '9464', '2021-06-04', '11:53:05', 9, 4),
(33, '5000', '2021-06-04', '11:53:17', 9, 3),
(34, '2500', '2021-06-04', '12:09:30', 9, 2),
(35, '2500', '2021-06-04', '12:09:47', 9, 2),
(36, '5000', '2021-06-05', '02:31:01', 11, 1),
(37, '20', '2021-06-05', '02:34:41', 11, 1),
(38, '20', '2021-06-05', '02:34:44', 11, 2),
(39, '20', '2021-06-05', '02:34:47', 11, 1),
(40, '20', '2021-06-05', '02:34:50', 11, 2),
(41, '20', '2021-06-05', '02:34:53', 11, 7),
(42, '20', '2021-06-05', '02:34:56', 11, 1),
(43, '20', '2021-06-05', '02:34:59', 11, 1),
(44, '3500', '2021-06-13', '04:24:41', 13, 2),
(45, '9000', '2021-06-13', '07:51:14', 13, 1),
(46, '9800', '2021-06-14', '01:00:57', 14, 1),
(47, '5600', '2021-06-14', '01:01:02', 14, 2),
(48, '10000', '2021-06-16', '01:19:14', 15, 1),
(49, '3500', '2021-06-16', '01:19:57', 15, 4),
(50, '6500', '2021-06-16', '04:12:09', 15, 2),
(51, '6500', '2021-06-17', '03:50:51', 16, 1),
(59, '10500', '2021-09-18', '06:16:54', 21, 1),
(60, '25000', '2021-09-21', '03:17:02', 23, 1),
(61, '900', '2021-09-21', '03:17:18', 23, 3),
(62, '20000', '2021-09-24', '10:13:24', 24, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `billsdetails`
--

CREATE TABLE `billsdetails` (
  `idbillsDetails` int(11) NOT NULL,
  `name` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `billsdetails`
--

INSERT INTO `billsdetails` (`idbillsDetails`, `name`) VALUES
(1, 'almuerzo'),
(2, 'jabon en polvo'),
(3, 'matrix'),
(4, 'clorox'),
(5, 'aguacates'),
(6, '123123123'),
(7, '20'),
(8, 'a012012');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cashbox`
--

CREATE TABLE `cashbox` (
  `id` int(11) NOT NULL,
  `idTurn` int(11) NOT NULL,
  `date` date NOT NULL,
  `amount` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `cashbox`
--

INSERT INTO `cashbox` (`id`, `idTurn`, `date`, `amount`) VALUES
(12, 26, '2021-11-03', '50000'),
(13, 29, '2021-11-05', '45000'),
(14, 31, '2022-04-15', '43000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `client`
--

CREATE TABLE `client` (
  `idClient` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `complement` varchar(500) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `client`
--

INSERT INTO `client` (`idClient`, `name`, `complement`, `status`) VALUES
(1, 'brayan', 'motos', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detailsprodcasespecial`
--

CREATE TABLE `detailsprodcasespecial` (
  `idDetailsProdCaseSpecial` int(11) NOT NULL,
  `idProduct` int(11) NOT NULL,
  `amount` double NOT NULL,
  `fk_idProductCaseSpecial` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `detailsprodcasespecial`
--

INSERT INTO `detailsprodcasespecial` (`idDetailsProdCaseSpecial`, `idProduct`, `amount`, `fk_idProductCaseSpecial`) VALUES
(1, 101, 1, 2),
(2, 101, 0.5, 3),
(3, 101, 0.25, 4),
(4, 101, 0.25, 5),
(5, 101, 0.25, 6),
(6, 101, 0.25, 7),
(7, 101, 1, 8),
(8, 101, 1.5, 9),
(9, 101, 2, 10),
(10, 101, 0.25, 11),
(11, 101, 0.5, 12),
(12, 101, 1, 13),
(13, 101, 0.25, 14),
(14, 101, 0.25, 15),
(15, 101, 2, 16),
(16, 102, 1, 17),
(17, 102, 1, 18),
(18, 102, 1, 19),
(19, 103, 1, 20),
(20, 103, 1, 21),
(21, 104, 1, 22),
(22, 104, 1, 23),
(23, 102, 0.5, 24),
(24, 10, 1, 35),
(25, 11, 1123123, 35),
(26, 16, 12123, 35),
(27, 10, 1, 36),
(28, 11, 1, 36),
(29, 10, 1, 37),
(30, 11, 1, 37),
(31, 10, 2, 38),
(32, 10, 2, 39),
(33, 101, 2, 40),
(34, 101, 2, 41),
(35, 101, 2, 42),
(36, 29, 1, 43),
(37, 101, 1, 43),
(38, 10, 1, 44),
(39, 58, 2, 45),
(40, 28, 1, 45);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `discharged`
--

CREATE TABLE `discharged` (
  `idDischarged` int(11) NOT NULL,
  `amount` double NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `price` varchar(11) NOT NULL,
  `fk_idProduct` int(11) NOT NULL,
  `fk_idTurn` int(11) NOT NULL,
  `fk_idDischargedDetails` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `discharged`
--

INSERT INTO `discharged` (`idDischarged`, `amount`, `date`, `time`, `price`, `fk_idProduct`, `fk_idTurn`, `fk_idDischargedDetails`) VALUES
(1, 1, '2021-11-05', '03:45:57', '', 1, 29, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dischargeddetails`
--

CREATE TABLE `dischargeddetails` (
  `iddischargedDetails` int(11) NOT NULL,
  `name` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `dischargeddetails`
--

INSERT INTO `dischargeddetails` (`iddischargedDetails`, `name`) VALUES
(1, 'almuerzo'),
(2, 'devolucion'),
(3, 'vencimiento'),
(4, 'visita'),
(5, 'asdasd'),
(6, '1'),
(7, 'asdasas'),
(8, 'asdaasas'),
(9, 'asdacxaaas'),
(10, 'prueba'),
(11, 'segunda prueba');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historyprice`
--

CREATE TABLE `historyprice` (
  `idHistoryPrice` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fk_idProduct` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `historyprice`
--

INSERT INTO `historyprice` (`idHistoryPrice`, `price`, `date`, `fk_idProduct`) VALUES
(1, 17000, '2021-03-01 20:00:00', 1),
(2, 9000, '2021-03-01 20:00:00', 2),
(3, 5000, '2021-03-01 20:00:00', 3),
(4, 2000, '2021-03-01 20:00:00', 4),
(5, 2500, '2021-03-01 20:00:00', 5),
(6, 3000, '2021-03-01 20:00:00', 6),
(7, 7000, '2021-03-01 20:00:00', 7),
(8, 10000, '2021-03-01 20:00:00', 8),
(9, 10000, '2021-03-01 20:00:00', 9),
(10, 10000, '2021-03-01 20:00:00', 11),
(11, 10000, '2021-03-01 20:00:00', 10),
(12, 9000, '2021-03-01 20:00:00', 12),
(13, 10000, '2021-03-01 20:00:00', 13),
(14, 9000, '2021-03-01 20:00:00', 14),
(15, 15000, '2021-03-01 20:00:00', 15),
(16, 10000, '2021-03-01 20:00:00', 16),
(17, 3500, '2021-03-01 20:00:00', 17),
(18, 5000, '2021-03-01 20:00:00', 18),
(19, 5500, '2021-03-01 20:00:00', 19),
(20, 2500, '2021-03-01 20:00:00', 20),
(21, 3000, '2021-03-01 20:00:00', 21),
(22, 2500, '2021-03-01 20:00:00', 22),
(23, 1500, '2021-03-01 20:00:00', 23),
(24, 2000, '2021-03-01 20:00:00', 24),
(25, 2000, '2021-03-01 20:00:00', 25),
(26, 2000, '2021-03-01 20:00:00', 26),
(27, 2000, '2021-03-01 20:00:00', 27),
(28, 1500, '2021-03-01 20:00:00', 28),
(29, 3800, '2021-03-01 20:00:00', 29),
(30, 15000, '2021-03-01 20:00:00', 30),
(31, 2500, '2021-03-01 20:00:00', 31),
(32, 2500, '2021-03-01 20:00:00', 32),
(33, 2700, '2021-03-01 20:00:00', 33),
(34, 2000, '2021-03-01 20:00:00', 34),
(35, 15000, '2021-03-01 20:00:00', 35),
(36, 500, '2021-03-01 20:00:00', 37),
(37, 24000, '2021-03-01 20:00:00', 40),
(38, 29000, '2021-03-01 20:00:00', 41),
(39, 34000, '2021-03-01 20:00:00', 42),
(40, 12000, '2021-03-01 20:00:00', 43),
(41, 16000, '2021-03-01 20:00:00', 44),
(42, 22000, '2021-03-01 20:00:00', 45),
(43, 24000, '2021-03-01 20:00:00', 46),
(44, 30000, '2021-03-01 20:00:00', 47),
(45, 8000, '2021-03-01 20:00:00', 50),
(46, 2000, '2021-03-01 20:00:00', 51),
(47, 3500, '2021-03-01 20:00:00', 52),
(48, 5500, '2021-03-01 20:00:00', 53),
(49, 8000, '2021-03-01 20:00:00', 54),
(50, 15000, '2021-03-01 20:00:00', 61),
(51, 15000, '2021-03-01 20:00:00', 62),
(52, 11000, '2021-03-01 20:00:00', 64),
(53, 30000, '2021-03-01 20:00:00', 65),
(54, 15000, '2021-03-01 20:00:00', 66),
(55, 1000, '2021-03-01 20:00:00', 100),
(56, 6500, '2021-05-28 19:59:22', 106),
(57, 9800, '2021-05-28 20:00:46', 36),
(58, 15000, '2021-05-28 20:02:19', 38),
(59, 15000, '2021-05-28 20:04:04', 39),
(60, 45000, '2021-05-28 20:04:53', 48),
(61, 45000, '2021-05-28 20:05:16', 49),
(62, 45000, '2021-05-28 20:05:47', 55),
(63, 123123, '2021-05-28 20:06:41', 56),
(64, 123123, '2021-05-28 20:07:49', 57),
(65, 123123, '2021-05-28 23:44:32', 67),
(66, 123123, '2021-05-28 23:44:51', 68),
(67, 123123, '2021-05-28 23:45:04', 69),
(68, 12312, '2021-05-28 23:50:02', 70),
(69, 123123, '2021-05-29 00:46:45', 71),
(70, 123123, '2021-05-29 00:52:30', 72),
(71, 123123, '2021-05-29 00:58:21', 73),
(72, 12231, '2021-05-29 00:59:00', 74),
(73, 12000, '2021-05-29 04:04:02', 75),
(74, 17, '2021-05-29 04:40:59', 1),
(75, 12, '2021-05-29 04:41:10', 75),
(76, 12000, '2021-05-29 04:42:04', 75),
(77, 12000, '2021-05-29 04:43:29', 75),
(78, 17000, '2021-05-29 23:32:03', 1),
(79, 19000, '2021-06-04 22:26:19', 1),
(80, 18000, '2021-06-14 22:57:05', 1),
(81, 16000, '2021-11-05 17:57:44', 76),
(82, 16000, '2021-11-05 18:01:46', 76),
(83, 12000, '2021-11-05 18:02:38', 77),
(84, 9500, '2021-11-05 19:28:21', 78),
(85, 19000, '2021-11-05 20:44:57', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inputproduct`
--

CREATE TABLE `inputproduct` (
  `idInputProduct` int(11) NOT NULL,
  `price` varchar(11) NOT NULL,
  `amount` double NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `fk_idUser` int(11) NOT NULL,
  `fk_idProduct` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `inputproduct`
--

INSERT INTO `inputproduct` (`idInputProduct`, `price`, `amount`, `date`, `time`, `fk_idUser`, `fk_idProduct`) VALUES
(1, '85000', 10, '2021-05-26', '09:14:38', 1, 101),
(2, '98000', 50, '2021-05-28', '11:27:35', 1, 101),
(9, '28500', 24, '2021-06-04', '02:04:01', 1, 28),
(10, '17000', 24, '2021-06-04', '04:35:32', 1, 34),
(11, '1500', 1, '2021-06-04', '04:35:47', 1, 35),
(12, '5', 5, '2021-06-04', '04:36:16', 1, 104),
(13, '5', 24, '2021-06-04', '04:36:33', 1, 31),
(14, '25000', 25, '2021-06-04', '04:36:58', 1, 101),
(15, '1', 1, '2021-06-04', '04:37:10', 1, 103),
(17, '95000', 5, '2021-06-13', '07:48:59', 1, 34),
(18, '98000', 1, '2021-06-14', '03:07:10', 1, 34),
(19, '100000', 100, '2021-06-14', '03:07:35', 1, 101),
(20, '326000', 125, '2021-06-16', '01:26:08', 1, 101),
(21, '35000', 40, '2021-09-18', '06:32:47', 1, 34),
(22, '55000', 30, '2021-09-21', '03:33:00', 1, 33);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `loans`
--

CREATE TABLE `loans` (
  `idLoans` int(11) NOT NULL,
  `price` varchar(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `idUserLoan` int(11) NOT NULL,
  `datePay` date DEFAULT NULL,
  `fk_idTurn` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `loans`
--

INSERT INTO `loans` (`idLoans`, `price`, `date`, `time`, `status`, `idUserLoan`, `datePay`, `fk_idTurn`) VALUES
(4, '25000', '2021-06-04', '01:53:37', 0, 1, NULL, 9),
(8, '5000', '2021-06-15', '02:56:05', 0, 1, NULL, 11),
(9, '60000', '2021-06-23', '08:01:55', 0, 1, NULL, 10),
(10, '5000', '2021-06-06', '12:02:29', 0, 1, NULL, 12),
(11, '10000', '2021-06-06', '12:02:36', 0, 1, NULL, 12),
(12, '1000', '2021-06-06', '12:02:42', 0, 1, NULL, 12),
(13, '1200', '2021-06-06', '12:02:46', 0, 1, NULL, 12),
(14, '1600', '2021-06-06', '12:02:52', 0, 1, NULL, 12),
(15, '6500', '2021-06-06', '12:03:01', 0, 1, NULL, 12),
(16, '2800', '2021-06-06', '12:07:30', 0, 1, NULL, 12),
(17, '2800', '2021-06-06', '12:07:36', 0, 1, NULL, 12),
(18, '2800', '2021-06-06', '12:07:42', 0, 1, NULL, 12),
(19, '2800', '2021-06-06', '12:07:47', 0, 1, NULL, 12),
(20, '2800', '2021-06-06', '12:07:52', 0, 1, NULL, 12),
(21, '99800', '2021-06-06', '12:13:48', 0, 1, NULL, 12),
(22, '20000', '2021-06-06', '12:53:45', 0, 2, NULL, 12),
(23, '25000', '2021-06-06', '01:05:17', 0, 2, NULL, 12),
(24, '25000', '2021-06-06', '01:06:54', 0, 2, '2021-06-16', 12),
(25, '6500', '2021-06-13', '07:51:28', 0, 2, '2021-06-17', 13),
(26, '9800', '2021-06-14', '01:01:10', 0, 3, '2021-06-16', 14),
(27, '7800', '2021-06-14', '03:17:44', 0, 4, '2021-06-16', 14),
(28, '50000', '2021-06-16', '01:20:39', 0, 1, NULL, 15),
(29, '7800', '2021-06-16', '01:20:45', 0, 2, '2021-06-17', 15),
(30, '15000', '2021-06-17', '03:51:01', 0, 3, '2021-09-18', 16),
(32, '12500', '2021-09-18', '06:05:51', 0, 3, '2021-09-21', 21),
(33, '5700', '2021-09-18', '06:16:34', 0, 4, '2021-09-18', 21),
(34, '50000', '2021-09-18', '06:34:54', 0, 1, NULL, 21),
(35, '50000', '2021-09-21', '03:17:34', 1, 1, NULL, 23),
(36, '30000', '2021-09-24', '09:52:50', 0, 2, '2021-09-24', 24),
(37, '20000', '2021-09-24', '10:13:41', 1, 2, NULL, 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notifications`
--

CREATE TABLE `notifications` (
  `idNotifications` int(11) NOT NULL,
  `status` varchar(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `fk_idUser` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `observationsales`
--

CREATE TABLE `observationsales` (
  `idObservationSales` int(11) NOT NULL,
  `description` varchar(500) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `idUserOS` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `observationsales`
--

INSERT INTO `observationsales` (`idObservationSales`, `description`, `date`, `time`, `status`, `idUserOS`) VALUES
(1, 'Fiado: fiado', '2021-06-02', '04:53:17', 1, 1),
(2, 'Fiado: Nueva obs', '2021-06-02', '05:18:18', 1, 1),
(4, 'asdd', '2021-06-04', '03:23:57', 1, 1),
(5, 'asdasd', '2021-06-13', '12:11:54', 0, 1),
(6, 'Prueba de redireccionamiento', '2021-06-13', '01:34:16', 0, 1),
(7, 'asdads', '2021-06-13', '01:35:18', 0, 1),
(8, 'qweqwa', '2021-06-13', '06:52:36', 0, 1),
(9, 'Pollo danado', '2021-09-21', '03:36:25', 1, 1),
(10, 'asd', '2021-11-05', '02:21:09', 0, 1),
(11, 'asd', '2021-11-05', '02:21:56', 0, 1),
(12, 'asdasd', '2021-11-05', '02:22:05', 0, 1),
(13, 'asdasd', '2021-11-05', '02:23:57', 0, 1),
(14, 'asdasd', '2021-11-05', '02:24:44', 0, 1),
(15, 'asd', '2021-11-05', '03:39:01', 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `payturn`
--

CREATE TABLE `payturn` (
  `idPayTurn` int(11) NOT NULL,
  `price` varchar(11) NOT NULL,
  `idUserPayTurn` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `fk_idTurn` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `payturn`
--

INSERT INTO `payturn` (`idPayTurn`, `price`, `idUserPayTurn`, `date`, `time`, `fk_idTurn`) VALUES
(2, '12333', 3, '2021-06-03', '05:48:20', 8),
(5, '25000', 2, '2021-06-03', '06:25:20', 8),
(12, '32000', 4, '2021-06-04', '02:56:56', 9),
(14, '35000', 2, '2021-06-04', '05:56:08', 9),
(15, '25000', 2, '2021-06-05', '02:31:16', 11),
(17, '30000', 2, '2021-06-06', '01:07:20', 12),
(18, '35000', 2, '2021-06-13', '04:26:01', 13),
(19, '55000', 2, '2021-06-14', '01:01:34', 14),
(20, '45000', 3, '2021-06-14', '01:39:33', 14),
(22, '35000', 2, '2021-06-16', '02:56:27', 15),
(23, '30000', 4, '2021-06-16', '03:59:34', 15),
(24, '40000', 3, '2021-06-16', '04:05:48', 15),
(25, '35000', 2, '2021-06-17', '03:51:20', 16),
(29, '40000', 3, '2021-09-18', '06:18:49', 21),
(30, '35000', 4, '2021-09-18', '06:19:16', 21),
(31, '35000', 3, '2021-09-21', '03:18:39', 23),
(32, '30000', 2, '2021-09-24', '09:53:19', 24),
(33, '30000', 3, '2021-09-24', '10:14:17', 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `position`
--

CREATE TABLE `position` (
  `idPosition` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `position`
--

INSERT INTO `position` (`idPosition`, `name`) VALUES
(1, 'Admin'),
(2, 'Caja'),
(3, 'Cocina'),
(4, 'Horno'),
(5, 'Turno');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product`
--

CREATE TABLE `product` (
  `idProduct` int(11) NOT NULL,
  `name` varchar(500) NOT NULL,
  `amount` double DEFAULT NULL,
  `menu` int(11) NOT NULL DEFAULT 1,
  `status` int(11) NOT NULL DEFAULT 1,
  `fk_idProdCaseSpecial` int(11) NOT NULL,
  `minAmount` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `product`
--

INSERT INTO `product` (`idProduct`, `name`, `amount`, `menu`, `status`, `fk_idProdCaseSpecial`, `minAmount`) VALUES
(1, 'Asado', NULL, 1, 1, 2, 1),
(2, '1/2 Asado', NULL, 1, 1, 3, 1),
(3, '1/4 Asado', NULL, 1, 1, 4, 1),
(4, 'Taza de Menudencia', NULL, 1, 1, 1, 1),
(5, 'Taza de Mondongo', NULL, 1, 1, 1, 1),
(6, 'Taza de Ajiaco', NULL, 1, 1, 1, 1),
(7, 'Combo Menudencia', NULL, 1, 1, 6, 1),
(8, 'Churrasco', NULL, 1, 1, 18, 1),
(9, 'Carne Asada', NULL, 1, 1, 17, 1),
(10, 'Sobrebarriga', 2, 1, 1, 1, 3),
(11, 'Lomo de Cerdo', 5, 1, 1, 1, 1),
(12, 'Bandeja con Pollo', NULL, 1, 1, 5, 1),
(13, 'Pechuga a la Plancha', NULL, 1, 1, 20, 1),
(14, 'Arroz con Pollo', NULL, 1, 1, 7, 1),
(15, 'Trucha', 60, 1, 1, 1, 1),
(16, 'Mojarra Mini', 0, 1, 1, 1, 1),
(17, 'Sopa de Menudencia', NULL, 1, 1, 1, 1),
(18, 'Sopa de Ajiaco', NULL, 1, 1, 1, 1),
(19, 'Sopa de Mondongo', NULL, 1, 1, 1, 1),
(20, 'P. Salada', NULL, 1, 1, 1, 1),
(21, 'P. Francesa', NULL, 1, 1, 1, 1),
(22, 'P. Yuca', NULL, 1, 1, 1, 1),
(23, 'P. Platano', NULL, 1, 1, 1, 1),
(24, 'P. Patacon', NULL, 1, 1, 1, 1),
(25, 'P. Arroz', NULL, 1, 1, 1, 1),
(26, 'P. Ensalada', NULL, 1, 1, 1, 1),
(27, 'Gaseosa 350 ml', 172, 1, 1, 1, 1),
(28, 'Gaseosa 250 ml', 37, 1, 1, 1, 1),
(29, 'Gaseosa 1.5 Lts', 16, 1, 1, 1, 1),
(30, 'Bandeja Paisa', NULL, 1, 1, 24, 1),
(31, 'Malta', 34, 1, 1, 1, 1),
(32, 'Cola & Pola', 9, 1, 1, 1, 8),
(33, 'Cerveza', 1, 1, 1, 1, 1),
(34, 'Agua', 979, 1, 1, 1, 1),
(35, 'Mojarra Especial', 7, 1, 1, 1, 1),
(36, 'Pizza', NULL, 1, 1, 37, 1),
(37, 'Icopor', NULL, 1, 1, 1, 1),
(38, 'Sobrebarriga Especial', NULL, 1, 1, 38, 1),
(39, 'Sobrebarriga Especial', NULL, 1, 1, 39, 1),
(40, 'Combo 1', NULL, 1, 1, 8, 1),
(41, 'Combo 2', NULL, 1, 1, 9, 1),
(42, 'Combo 3', NULL, 1, 1, 10, 1),
(43, 'A. Chino Personal', NULL, 1, 1, 1, 1),
(44, 'A. Chino Personal + 1/4', NULL, 1, 1, 11, 1),
(45, 'A. Chino Duo + 1/2', NULL, 1, 1, 12, 1),
(46, 'A. Chino Duo + C. BBQ', NULL, 1, 1, 23, 1),
(47, 'A. Chino Familiar + 1', NULL, 1, 1, 13, 1),
(48, 'A. Chino Super Especial', NULL, 1, 1, 40, 1),
(49, 'A. Chino Super Especial', NULL, 1, 1, 41, 1),
(50, 'Combo con Mondongo', NULL, 1, 1, 14, 1),
(51, 'Jugo en Agua', NULL, 1, 1, 1, 1),
(52, 'Jugo en Leche', NULL, 1, 1, 1, 1),
(53, 'Gaseosa 3 Lts', 9, 1, 1, 1, 1),
(54, 'Combo con Ajiaco', NULL, 1, 1, 15, 1),
(55, 'A. Chino Super Especial', NULL, 1, 1, 42, 1),
(56, 'A. Chino Otro', NULL, 1, 1, 43, 1),
(57, 'Otra Prueba', NULL, 1, 1, 44, 1),
(58, 'Hamburguesa', 12, 0, 1, 1, 1),
(59, 'Hamburguesa', 12, 0, 1, 1, 1),
(60, 'Salchicha Perro', 12, 0, 1, 1, 1),
(61, 'Tabla Mixta', NULL, 1, 1, 1, 1),
(62, 'Pechuga Gratinada', NULL, 1, 1, 21, 1),
(63, 'Otra Prueba', 1, 0, 1, 1, 1),
(64, 'Costillitas BBQ', NULL, 1, 1, 22, 1),
(65, 'Promocion x2 Pollos', NULL, 1, 1, 16, 1),
(66, 'Churrasco Especial', NULL, 1, 1, 19, 1),
(67, 'Prueba', NULL, 1, 1, 1, 1),
(68, 'Prueba2', NULL, 1, 1, 1, 1),
(69, 'Prueba3', NULL, 1, 1, 1, 1),
(70, 'Servicio De Bano', NULL, 1, 1, 1, 1),
(71, 'Menudencia Hpta', NULL, 1, 1, 1, 1),
(72, 'Prueba1', NULL, 1, 1, 1, 1),
(73, 'Hamburguesa', NULL, 1, 1, 1, 1),
(74, 'Prueba4', NULL, 1, 1, 1, 1),
(75, 'Hamburguesa Especial 2 Carnes', NULL, 1, 1, 45, 1),
(76, 'Trucha Grande', NULL, 1, 1, 1, 0),
(77, 'Trucha Pequena', 10, 1, 1, 1, 5),
(78, 'Mojarra', 7, 1, 1, 1, 9),
(100, 'Baño', NULL, 1, 1, 1, 1),
(101, 'Pollo', 210.25, 0, 1, 1, 1),
(102, 'Carne', 4.5, 0, 1, 1, 1),
(103, 'Pechuga', 2, 0, 1, 1, 1),
(104, 'Costillas BBQ', 15, 0, 1, 1, 1),
(105, 'Hamburguesa', NULL, 1, 1, 35, 1),
(106, 'Hamburguesa', NULL, 1, 1, 36, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productcasespecial`
--

CREATE TABLE `productcasespecial` (
  `idproductCaseSpecial` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `productcasespecial`
--

INSERT INTO `productcasespecial` (`idproductCaseSpecial`) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13),
(14),
(15),
(16),
(17),
(18),
(19),
(20),
(21),
(22),
(23),
(24),
(34),
(35),
(36),
(37),
(38),
(39),
(40),
(41),
(42),
(43),
(44),
(45);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sales`
--

CREATE TABLE `sales` (
  `idSales` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `amount` double NOT NULL,
  `price` varchar(11) NOT NULL,
  `fk_idTurn` int(11) NOT NULL,
  `fk_idProduct` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `sales`
--

INSERT INTO `sales` (`idSales`, `date`, `time`, `amount`, `price`, `fk_idTurn`, `fk_idProduct`) VALUES
(1, '2021-11-05', '03:18:37', 1, '18000', 29, 1),
(2, '2021-11-05', '03:23:28', 1, '18000', 29, 1),
(3, '2021-11-05', '03:27:56', 2, '18000', 29, 1),
(4, '2021-11-05', '03:39:01', 1, '1000', 29, 100),
(5, '2021-11-05', '03:45:09', 1, '19000', 29, 1),
(6, '2021-11-05', '03:58:08', 1, '5000', 29, 3),
(7, '2021-11-05', '03:58:08', 1, '2000', 29, 27),
(8, '2021-11-05', '03:58:41', 1, '19000', 29, 1),
(9, '2021-11-05', '03:58:41', 1, '10000', 29, 9),
(10, '2021-11-05', '09:18:40', 1, '19000', 29, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('XRE4DUvSJ9M4Oyn6UmjyeF-FGITvGbTS', 1650131621, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{}}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trust`
--

CREATE TABLE `trust` (
  `idTrust` int(11) NOT NULL,
  `amount` double NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `status` varchar(45) NOT NULL,
  `price` varchar(11) NOT NULL,
  `fk_idTurn` int(11) NOT NULL,
  `fk_idClient` int(11) NOT NULL,
  `fk_idProduct` int(11) NOT NULL,
  `datePay` timestamp NULL DEFAULT NULL,
  `idTurnRegisterPay` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `trust`
--

INSERT INTO `trust` (`idTrust`, `amount`, `date`, `time`, `status`, `price`, `fk_idTurn`, `fk_idClient`, `fk_idProduct`, `datePay`, `idTurnRegisterPay`) VALUES
(1, 1, '2021-11-05', '03:27:17', '1', '18000', 29, 1, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turn`
--

CREATE TABLE `turn` (
  `idTurn` int(11) NOT NULL,
  `date` date NOT NULL,
  `timeStart` time NOT NULL,
  `timeEnd` time DEFAULT NULL,
  `fk_idUser` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `turn`
--

INSERT INTO `turn` (`idTurn`, `date`, `timeStart`, `timeEnd`, `fk_idUser`) VALUES
(7, '2021-06-02', '12:20:39', NULL, 1),
(8, '2021-06-03', '04:28:03', NULL, 1),
(9, '2021-06-04', '12:00:22', NULL, 1),
(10, '2021-06-05', '12:52:39', NULL, 1),
(11, '2021-06-05', '02:29:34', NULL, 2),
(12, '2021-06-06', '12:01:37', NULL, 1),
(13, '2021-06-13', '12:10:38', NULL, 1),
(14, '2021-06-14', '12:59:23', NULL, 1),
(15, '2021-06-16', '12:02:11', NULL, 1),
(16, '2021-06-17', '11:10:53', NULL, 1),
(17, '2021-06-17', '04:28:58', NULL, 2),
(18, '2021-09-07', '08:07:46', NULL, 2),
(19, '2021-09-07', '08:10:35', NULL, 1),
(20, '2021-09-07', '08:10:47', NULL, 31),
(21, '2021-09-18', '06:05:36', NULL, 1),
(22, '2021-09-19', '02:19:23', NULL, 1),
(23, '2021-09-21', '03:13:55', NULL, 1),
(24, '2021-09-24', '09:33:53', NULL, 1),
(25, '2021-09-24', '09:58:45', NULL, 2),
(26, '2021-11-03', '01:31:12', NULL, 1),
(27, '2021-11-03', '05:36:14', NULL, 2),
(28, '2021-11-03', '06:09:14', NULL, 3),
(29, '2021-11-05', '01:05:03', NULL, 1),
(30, '2021-11-05', '08:15:21', NULL, 2),
(31, '2022-04-15', '12:52:56', NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `idUser` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `imgProfile` varchar(500) DEFAULT NULL,
  `rol` int(11) NOT NULL,
  `fk_idUserLogin` int(11) NOT NULL,
  `fk_idPosition` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`idUser`, `name`, `imgProfile`, `rol`, `fk_idUserLogin`, `fk_idPosition`) VALUES
(1, 'Emma', '6hopplkv.jpg', 1, 1, 1),
(2, 'Maria', 'ie0t9j6f.jpg', 0, 2, 3),
(3, 'Luis', '7p3o9t8f.jpg', 0, 3, 4),
(4, 'Diego', 'u67u8uap.jpg', 0, 4, 5),
(20, 'Prueba 1', NULL, 0, 20, 2),
(21, 'prueba1', '4gb3zex9.jpg', 0, 21, 3),
(22, 'prueba', 'bmpsajsb.jpg', 0, 22, 2),
(23, 'camilo', 'vw7a6o9d.jfif', 0, 23, 2),
(24, 'aasdasd', 'et7t1zh9.jpg', 0, 24, 3),
(25, 'otraprueba', 'z102001p.jpg', 0, 25, 2),
(26, 'luis comnunica', 'tenvp4k1.jpg', 0, 26, 2),
(27, 'cecilio', 'exx6jap8.jpg', 0, 27, 4),
(28, 'Camilo', 'xp5okije.jpg', 0, 28, 3),
(29, 'Camilo', 'rs4fdt1n.jpg', 0, 29, 2),
(30, 'Camilo Hamon', 'vk4cfj0e.jpg', 0, 30, 2),
(31, 'Camilo', NULL, 1, 31, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `userlogin`
--

CREATE TABLE `userlogin` (
  `idUserLogin` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(500) NOT NULL,
  `userStatus` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `userlogin`
--

INSERT INTO `userlogin` (`idUserLogin`, `username`, `password`, `userStatus`) VALUES
(1, 'emma2306', '$2a$10$wq1/3f7bqEB5fPgsOv2t3ONeEr0BQXbPteCoaSa9NFN6vooUsxH7W', 1),
(2, 'maria2021', '$2a$10$UGxnxukJnNf38vfaTA44Ou4ooJxbMK6qA505Gef09t0Kd33Bg5n3q', 1),
(3, 'luis2021', '$2a$10$390Vw99DWFIBvJ8tyCZlJuf8Ije8CecDKUzuixdAff1sCbKQ..hk6', 1),
(4, 'diego2021', '$2a$10$jJY.F9ugcY9pkWC5B5DJhOnhhnMfandpP0l8TiVDMAWa.q8VMv5LO', 0),
(20, 'prueba', '$2a$10$jpXG81xEqUv39Fe4TOU/cucFopUy60YR1vSCsozcRyHunNwxAyccK', 0),
(21, 'prueba2', '$2a$10$xwKilIiHU0LG.5R3eaNGduncSr3HCTJ2AF3mHkCDF5vpUxFcqs4G.', 0),
(22, 'otra', '$2a$10$ieWyVzygz2aVHIJv0D9SOOdWwCE9/Qx21XP2z0bpgxBK1hcy/l9um', 0),
(23, 'camilo', '$2a$10$bf5ktoy20XYfNlDMYX2s5.mlsmD3OWWTo1YEOQzJ.7SvwcdLhHuua', 0),
(24, 'context', '$2a$10$xtJA22h8haKbL1B09aU2ceSePisx4Js6McZiL3mKfh0kOTk.eKLfO', 0),
(25, 'camilo2', '$2a$10$IQSquzTOC.zsv8xSgnyVx.1X45xtiQvwJqJRT3V.va/ULdLFPfTse', 0),
(26, 'luisito', '$2a$10$y8Uavp1ohva6JUFxIo.TzOaAduH0dbymsIztZY5TBNjHC8tLbAdFW', 0),
(27, 'cecilio2021', '$2a$10$1wc9yb3K.C8.tpplPDdtROknra1su.FatVQ9L/gB6rM7WXPv5r1vi', 0),
(28, 'camilo123', '$2a$10$G0No/8gR51ffaZf/aaUDR.arHPTdXMRcoPvn7wrSmXS5ChGTNwPRC', 0),
(29, 'camilo2021', '$2a$10$nDFvEbgvVAlXa9/jFvAXNO36txKx6ApeT7Pqn6e.dc9gcU0lgkIMu', 0),
(30, 'camilo20', '$2a$10$9TvAMgX.0O3nxfDKHW0queQnOPN0RtpMdWlB8Zn6T8zzOd1Nee4Uy', 0),
(31, 'gabriel', '$2a$10$wq1/3f7bqEB5fPgsOv2t3ONeEr0BQXbPteCoaSa9NFN6vooUsxH7W', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`idBills`),
  ADD KEY `fk_bills_turn1` (`fk_idTurn`),
  ADD KEY `fk_bills_billsDetails1` (`fk_idBillsDetails`);

--
-- Indices de la tabla `billsdetails`
--
ALTER TABLE `billsdetails`
  ADD PRIMARY KEY (`idbillsDetails`);

--
-- Indices de la tabla `cashbox`
--
ALTER TABLE `cashbox`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`idClient`);

--
-- Indices de la tabla `detailsprodcasespecial`
--
ALTER TABLE `detailsprodcasespecial`
  ADD PRIMARY KEY (`idDetailsProdCaseSpecial`),
  ADD KEY `fk_detailsProdCaseSpecial_productCaseSpecial1` (`fk_idProductCaseSpecial`);

--
-- Indices de la tabla `discharged`
--
ALTER TABLE `discharged`
  ADD PRIMARY KEY (`idDischarged`),
  ADD KEY `fk_discharged_turn1` (`fk_idTurn`),
  ADD KEY `fk_discharged_dischargedDetails1` (`fk_idDischargedDetails`);

--
-- Indices de la tabla `dischargeddetails`
--
ALTER TABLE `dischargeddetails`
  ADD PRIMARY KEY (`iddischargedDetails`);

--
-- Indices de la tabla `historyprice`
--
ALTER TABLE `historyprice`
  ADD PRIMARY KEY (`idHistoryPrice`),
  ADD KEY `fk_historyPrice_product1` (`fk_idProduct`);

--
-- Indices de la tabla `inputproduct`
--
ALTER TABLE `inputproduct`
  ADD PRIMARY KEY (`idInputProduct`),
  ADD KEY `fk_inputProduct_product1` (`fk_idProduct`),
  ADD KEY `fk_inputProduct_user1` (`fk_idUser`);

--
-- Indices de la tabla `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`idLoans`),
  ADD KEY `fk_loans_turn1` (`fk_idTurn`);

--
-- Indices de la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`idNotifications`),
  ADD KEY `fk_notifications_user1` (`fk_idUser`);

--
-- Indices de la tabla `observationsales`
--
ALTER TABLE `observationsales`
  ADD PRIMARY KEY (`idObservationSales`);

--
-- Indices de la tabla `payturn`
--
ALTER TABLE `payturn`
  ADD PRIMARY KEY (`idPayTurn`),
  ADD KEY `fk_payTurn_turn1` (`fk_idTurn`);

--
-- Indices de la tabla `position`
--
ALTER TABLE `position`
  ADD PRIMARY KEY (`idPosition`);

--
-- Indices de la tabla `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`idProduct`),
  ADD KEY `fk_product_productCaseSpecial1` (`fk_idProdCaseSpecial`);

--
-- Indices de la tabla `productcasespecial`
--
ALTER TABLE `productcasespecial`
  ADD PRIMARY KEY (`idproductCaseSpecial`);

--
-- Indices de la tabla `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`idSales`),
  ADD KEY `fk_sales_turn1` (`fk_idTurn`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `trust`
--
ALTER TABLE `trust`
  ADD PRIMARY KEY (`idTrust`),
  ADD KEY `fk_trust_client1` (`fk_idClient`),
  ADD KEY `fk_trust_turn1` (`fk_idTurn`);

--
-- Indices de la tabla `turn`
--
ALTER TABLE `turn`
  ADD PRIMARY KEY (`idTurn`),
  ADD KEY `fk_turn_user1` (`fk_idUser`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`idUser`),
  ADD KEY `fk_user_position1` (`fk_idPosition`),
  ADD KEY `fk_user_userLogin1` (`fk_idUserLogin`);

--
-- Indices de la tabla `userlogin`
--
ALTER TABLE `userlogin`
  ADD PRIMARY KEY (`idUserLogin`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bills`
--
ALTER TABLE `bills`
  MODIFY `idBills` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT de la tabla `billsdetails`
--
ALTER TABLE `billsdetails`
  MODIFY `idbillsDetails` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `cashbox`
--
ALTER TABLE `cashbox`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `client`
--
ALTER TABLE `client`
  MODIFY `idClient` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `detailsprodcasespecial`
--
ALTER TABLE `detailsprodcasespecial`
  MODIFY `idDetailsProdCaseSpecial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `discharged`
--
ALTER TABLE `discharged`
  MODIFY `idDischarged` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `dischargeddetails`
--
ALTER TABLE `dischargeddetails`
  MODIFY `iddischargedDetails` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `historyprice`
--
ALTER TABLE `historyprice`
  MODIFY `idHistoryPrice` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT de la tabla `inputproduct`
--
ALTER TABLE `inputproduct`
  MODIFY `idInputProduct` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `loans`
--
ALTER TABLE `loans`
  MODIFY `idLoans` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `notifications`
--
ALTER TABLE `notifications`
  MODIFY `idNotifications` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `observationsales`
--
ALTER TABLE `observationsales`
  MODIFY `idObservationSales` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `payturn`
--
ALTER TABLE `payturn`
  MODIFY `idPayTurn` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `position`
--
ALTER TABLE `position`
  MODIFY `idPosition` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `product`
--
ALTER TABLE `product`
  MODIFY `idProduct` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT de la tabla `productcasespecial`
--
ALTER TABLE `productcasespecial`
  MODIFY `idproductCaseSpecial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT de la tabla `sales`
--
ALTER TABLE `sales`
  MODIFY `idSales` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `trust`
--
ALTER TABLE `trust`
  MODIFY `idTrust` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `turn`
--
ALTER TABLE `turn`
  MODIFY `idTurn` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `userlogin`
--
ALTER TABLE `userlogin`
  MODIFY `idUserLogin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `fk_bills_billsDetails1` FOREIGN KEY (`fk_idBillsDetails`) REFERENCES `billsdetails` (`idbillsDetails`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_bills_turn1` FOREIGN KEY (`fk_idTurn`) REFERENCES `turn` (`idTurn`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `detailsprodcasespecial`
--
ALTER TABLE `detailsprodcasespecial`
  ADD CONSTRAINT `fk_detailsProdCaseSpecial_productCaseSpecial1` FOREIGN KEY (`fk_idProductCaseSpecial`) REFERENCES `productcasespecial` (`idproductCaseSpecial`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `discharged`
--
ALTER TABLE `discharged`
  ADD CONSTRAINT `fk_discharged_dischargedDetails1` FOREIGN KEY (`fk_idDischargedDetails`) REFERENCES `dischargeddetails` (`iddischargedDetails`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_discharged_turn1` FOREIGN KEY (`fk_idTurn`) REFERENCES `turn` (`idTurn`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `historyprice`
--
ALTER TABLE `historyprice`
  ADD CONSTRAINT `fk_historyPrice_product1` FOREIGN KEY (`fk_idProduct`) REFERENCES `product` (`idProduct`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `inputproduct`
--
ALTER TABLE `inputproduct`
  ADD CONSTRAINT `fk_inputProduct_product1` FOREIGN KEY (`fk_idProduct`) REFERENCES `product` (`idProduct`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_inputProduct_user1` FOREIGN KEY (`fk_idUser`) REFERENCES `user` (`idUser`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `fk_loans_turn1` FOREIGN KEY (`fk_idTurn`) REFERENCES `turn` (`idTurn`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_user1` FOREIGN KEY (`fk_idUser`) REFERENCES `user` (`idUser`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `payturn`
--
ALTER TABLE `payturn`
  ADD CONSTRAINT `fk_payTurn_turn1` FOREIGN KEY (`fk_idTurn`) REFERENCES `turn` (`idTurn`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `fk_product_productCaseSpecial1` FOREIGN KEY (`fk_idProdCaseSpecial`) REFERENCES `productcasespecial` (`idproductCaseSpecial`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `fk_sales_turn1` FOREIGN KEY (`fk_idTurn`) REFERENCES `turn` (`idTurn`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `trust`
--
ALTER TABLE `trust`
  ADD CONSTRAINT `fk_trust_client1` FOREIGN KEY (`fk_idClient`) REFERENCES `client` (`idClient`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_trust_turn1` FOREIGN KEY (`fk_idTurn`) REFERENCES `turn` (`idTurn`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `turn`
--
ALTER TABLE `turn`
  ADD CONSTRAINT `fk_turn_user1` FOREIGN KEY (`fk_idUser`) REFERENCES `user` (`idUser`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `fk_user_position1` FOREIGN KEY (`fk_idPosition`) REFERENCES `position` (`idPosition`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_user_userLogin1` FOREIGN KEY (`fk_idUserLogin`) REFERENCES `userlogin` (`idUserLogin`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
