/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50553
Source Host           : localhost:3306
Source Database       : wezchina_new

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2017-04-24 10:45:43
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for we_id_cards
-- ----------------------------
DROP TABLE IF EXISTS `we_id_cards`;
CREATE TABLE `we_id_cards` (
  `id` mediumint(8) NOT NULL AUTO_INCREMENT,
  `user_id` mediumint(8) NOT NULL,
  `name` varchar(30) NOT NULL,
  `id_card` varchar(50) NOT NULL,
  `dateline` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `info` varchar(100) DEFAULT NULL,
  `msg` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of we_id_cards
-- ----------------------------
