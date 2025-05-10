-- 添加nickname和mobile字段到users表
ALTER TABLE users ADD COLUMN nickname VARCHAR(100) DEFAULT NULL;
ALTER TABLE users ADD COLUMN mobile VARCHAR(20) DEFAULT NULL;