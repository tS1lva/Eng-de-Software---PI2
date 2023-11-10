DROP TABLE PASSAGEM;
DROP TABLE ASSENTO;
DROP TABLE VOO;
DROP TABLE TRECHO;
DROP TABLE AEROPORTO;
DROP TABLE CIDADE;
DROP TABLE AERONAVE;

DROP SEQUENCE SEQ_AERONAVE;
DROP SEQUENCE SEQ_AEROPORTO;
DROP SEQUENCE SEQ_ASSENTO;
DROP SEQUENCE SEQ_CIDADE;
DROP SEQUENCE SEQ_TRECHO;
DROP SEQUENCE SEQ_VOO;
DROP SEQUENCE SEQ_PASSAGEM;


--AERONAVES
CREATE TABLE AERONAVE (
    id_aeronave NUMBER PRIMARY KEY,
    modelo VARCHAR2(255),
    ano_fabri NUMBER,
    fabricante VARCHAR2(255)
);
CREATE SEQUENCE SEQ_AERONAVE 
START WITH 1 INCREMENT BY 1;

--CIDADE
CREATE TABLE CIDADE (
    id_cidade number PRIMARY KEY,
    nome varchar2(255)
);
CREATE SEQUENCE SEQ_CIDADE 
START WITH 1 INCREMENT BY 1;

--AEROPORTO
CREATE TABLE AEROPORTO (
    id_aeroporto number PRIMARY KEY,
    nome VARCHAR(255),
    cidade_id number,
    CONSTRAINT fk_aeroporto_cidade FOREIGN KEY (cidade_id) REFERENCES cidade(id_cidade)
);
CREATE SEQUENCE SEQ_AEROPORTO 
START WITH 1 INCREMENT BY 1;

--TRECHO
create table trecho (
    id_trecho number primary key,
    cidade_origem number,
    cidade_destino number,
    CONSTRAINT fk_cidadeO_cidade FOREIGN KEY (cidade_origem) REFERENCES cidade(id_cidade),
    CONSTRAINT fk_cidadeD_cidade FOREIGN KEY (cidade_destino) REFERENCES cidade(id_cidade)
);
CREATE SEQUENCE SEQ_TRECHO
START WITH 1 INCREMENT BY 1;

--VOO
CREATE TABLE VOO (
    id_voo NUMBER PRIMARY KEY,
    hora_origem varchar2(255),
    data_origem date,
    hora_chegada varchar2(255),
    data_chegada date,
    AEROPORTO_ORIGEM NUMBER,
    AEROPORTO_CHEGADA NUMBER,
    trecho_id NUMBER,
    aeronave_id NUMBER,
    valor FLOAT,
    CONSTRAINT fk_aeroportoO_aeroporto FOREIGN KEY (AEROPORTO_ORIGEM) REFERENCES AEROPORTO(id_aeroporto),
    CONSTRAINT fk_aeroportoC_aeroporto FOREIGN KEY (AEROPORTO_CHEGADA) REFERENCES AEROPORTO(id_aeroporto),
    CONSTRAINT fk_idTrecho_trecho FOREIGN KEY (trecho_id) REFERENCES TRECHO(id_trecho),
    constraint fk_id_aeronave_aeronave FOREIGN KEY (aeronave_id) REFERENCES AERONAVE (id_aeronave)
);
CREATE SEQUENCE SEQ_VOO
START WITH 1 INCREMENT BY 1;

--ASSENTO
CREATE TABLE ASSENTO (
    id_assento number primary key,
    voo_id NUMBER,
    linha number,
    coluna char,
    constraint fk_id_voo_voo FOREIGN KEY (voo_id) REFERENCES VOO (id_voo)
);

CREATE SEQUENCE SEQ_ASSENTO START WITH 1 INCREMENT BY 1;

CREATE TABLE PASSAGEM (
    id_passagem number primary key,
    nome varchar2(25),
    cpf varchar2(25),
    assento_id number,
    voo_id number,
    constraint fk_voo_id_voo FOREIGN key (voo_id) REFERENCES VOO (id_voo),
    constraint fk_id_assento_assento FOREIGN key(assento_id) REFERENCES ASSENTO (id_assento)
);

create SEQUENCE SEQ_PASSAGEM start WITH 1 INCREMENT by 1;

CREATE OR REPLACE TRIGGER BEFORE_INSERT_AEROPORTOS_TRIGGER
BEFORE INSERT ON VOO
FOR EACH ROW
DECLARE
    cidade_origem_id NUMBER;
    cidade_destino_id NUMBER;
    aeroporto_origem_id NUMBER;
    aeroporto_destino_id NUMBER;
BEGIN
    -- Obter as cidades de origem e destino do trecho do voo
    SELECT cidade_origem, cidade_destino INTO cidade_origem_id, cidade_destino_id
    FROM TRECHO
    WHERE id_trecho = :new.trecho_id;
    
    -- Obter os IDs dos aeroportos com base nas cidades de origem e destino
    SELECT id_aeroporto INTO aeroporto_origem_id
    FROM AEROPORTO
    WHERE cidade_id = cidade_origem_id;

    SELECT id_aeroporto INTO aeroporto_destino_id
    FROM AEROPORTO
    WHERE cidade_id = cidade_destino_id;
    
    -- Definir os campos de aeroportos no voo antes da inserção
    :new.AEROPORTO_ORIGEM := aeroporto_origem_id;
    :new.AEROPORTO_CHEGADA := aeroporto_destino_id;
END;
/


-- Inserts para aeronaves válidas
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Boeing 747', 1995, 'Boeing');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Airbus A320', 2005, 'Airbus');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Embraer E190', 2010, 'Embraer');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Boeing 777', 2000, 'Boeing');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Airbus A380', 2015, 'Airbus');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Embraer E145', 2008, 'Embraer');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Boeing 787', 2012, 'Boeing');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Airbus A330', 2007, 'Airbus');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Embraer E170', 2013, 'Embraer');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Boeing 737', 1998, 'Boeing');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Airbus A350', 2017, 'Airbus');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Embraer E175', 2011, 'Embraer');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Boeing 767', 2002, 'Boeing');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Airbus A330', 2006, 'Airbus');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Embraer E190', 2014, 'Embraer');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Boeing 787', 2016, 'Boeing');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Airbus A350', 2019, 'Airbus');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Embraer E175', 2020, 'Embraer');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Boeing 737', 2005, 'Boeing');
INSERT INTO AERONAVE (id_aeronave, modelo, ano_fabri, fabricante) VALUES (SEQ_AERONAVE.NEXTVAL, 'Airbus A330', 2010, 'Airbus');

-- Inserts para cidades válidas
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'São Paulo');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'Rio de Janeiro');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'Belo Horizonte');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'Brasília');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'Salvador');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'Fortaleza');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'Recife');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'Porto Alegre');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'Curitiba');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'Manaus');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'Salto');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'Natal');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'Vitória');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'Cuiabá');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'João Pessoa');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'São Luís');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'Teresina');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'Aracaju');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'Campo Grande');
INSERT INTO CIDADE (id_cidade, nome) VALUES (SEQ_CIDADE.NEXTVAL, 'Palmas');

-- Inserts para aeroportos válidos
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto Internacional de São Paulo', 1);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto Internacional do Rio de Janeiro', 2);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto de Belo Horizonte', 3);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto de Brasília', 4);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto de Salvador', 5);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto de Fortaleza', 6);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto de Recife', 7);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto de Porto Alegre', 8);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto de Curitiba', 9);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto de Manaus', 10);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto Internacional de Salto', 11);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto de Natal', 12);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto de Vitória', 13);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto de Cuiabá', 14);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto de João Pessoa', 15);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto de São Luís', 16);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto de Teresina', 17);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto de Aracaju', 18);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto de Campo Grande', 19);
INSERT INTO AEROPORTO (id_aeroporto, nome, cidade_id) VALUES (SEQ_AEROPORTO.NEXTVAL, 'Aeroporto de Palmas', 20);

-- Inserts para trechos válidos
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 1, 2);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 2, 3);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 3, 4);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 4, 5);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 5, 6);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 6, 7);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 7, 8);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 8, 9);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 9, 10);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 10, 1);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 2, 1);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 3, 2);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 4, 3);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 5, 4);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 6, 5);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 7, 6);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 8, 7);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 9, 8);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 10, 9);
INSERT INTO TRECHO (id_trecho, cidade_origem, cidade_destino) VALUES (SEQ_TRECHO.NEXTVAL, 1, 10);

-- Inserts para voos válidos
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, trecho_id, aeronave_id, valor) 
VALUES (SEQ_VOO.NEXTVAL, '08:00', TO_DATE('2023-11-14', 'YYYY-MM-DD'), '10:00', TO_DATE('2023-11-14', 'YYYY-MM-DD'), 1, 1, 300.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, trecho_id, aeronave_id, valor) 
VALUES (SEQ_VOO.NEXTVAL, '09:30', TO_DATE('2023-11-15', 'YYYY-MM-DD'), '11:30', TO_DATE('2023-11-15', 'YYYY-MM-DD'), 2, 2, 350.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, trecho_id, aeronave_id, valor) 
VALUES (SEQ_VOO.NEXTVAL, '11:00', TO_DATE('2023-11-16', 'YYYY-MM-DD'), '13:00', TO_DATE('2023-11-16', 'YYYY-MM-DD'), 3, 3, 400.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, trecho_id, aeronave_id, valor) 
VALUES (SEQ_VOO.NEXTVAL, '12:30', TO_DATE('2023-11-17', 'YYYY-MM-DD'), '14:30', TO_DATE('2023-11-17', 'YYYY-MM-DD'), 4, 4, 450.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, trecho_id, aeronave_id, valor) 
VALUES (SEQ_VOO.NEXTVAL, '14:00', TO_DATE('2023-11-18', 'YYYY-MM-DD'), '16:00', TO_DATE('2023-11-18', 'YYYY-MM-DD'), 5, 5, 500.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, trecho_id, aeronave_id, valor) 
VALUES (SEQ_VOO.NEXTVAL, '08:00', TO_DATE('2023-11-19', 'YYYY-MM-DD'), '10:00', TO_DATE('2023-11-19', 'YYYY-MM-DD'), 6, 6, 300.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, trecho_id, aeronave_id, valor) 
VALUES (SEQ_VOO.NEXTVAL, '09:30', TO_DATE('2023-11-20', 'YYYY-MM-DD'), '11:30', TO_DATE('2023-11-20', 'YYYY-MM-DD'), 7, 7, 350.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, trecho_id, aeronave_id, valor) 
VALUES (SEQ_VOO.NEXTVAL, '11:00', TO_DATE('2023-11-21', 'YYYY-MM-DD'), '13:00', TO_DATE('2023-11-21', 'YYYY-MM-DD'), 8, 8, 400.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, trecho_id, aeronave_id, valor) 
VALUES (SEQ_VOO.NEXTVAL, '12:30', TO_DATE('2023-11-22', 'YYYY-MM-DD'), '14:30', TO_DATE('2023-11-22', 'YYYY-MM-DD'), 9, 9, 450.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, trecho_id, aeronave_id, valor) 
VALUES (SEQ_VOO.NEXTVAL, '14:00', TO_DATE('2023-11-23', 'YYYY-MM-DD'), '16:00', TO_DATE('2023-11-23', 'YYYY-MM-DD'), 10, 10, 500.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, trecho_id, aeronave_id, valor) 
VALUES (SEQ_VOO.NEXTVAL, '08:00', TO_DATE('2023-11-24', 'YYYY-MM-DD'), '10:00', TO_DATE('2023-11-24', 'YYYY-MM-DD'), 11, 11, 300.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, trecho_id, aeronave_id, valor) 
VALUES (SEQ_VOO.NEXTVAL, '09:30', TO_DATE('2023-11-25', 'YYYY-MM-DD'), '11:30', TO_DATE('2023-11-25', 'YYYY-MM-DD'), 12, 12, 350.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, trecho_id, aeronave_id, valor) 
VALUES (SEQ_VOO.NEXTVAL, '11:00', TO_DATE('2023-11-26', 'YYYY-MM-DD'), '13:00', TO_DATE('2023-11-26', 'YYYY-MM-DD'), 13, 13, 400.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, trecho_id, aeronave_id, valor) 
VALUES (SEQ_VOO.NEXTVAL, '12:30', TO_DATE('2023-11-27', 'YYYY-MM-DD'), '14:30', TO_DATE('2023-11-27', 'YYYY-MM-DD'), 14, 14, 450.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, trecho_id, aeronave_id, valor) 
VALUES (SEQ_VOO.NEXTVAL, '14:00', TO_DATE('2023-11-28', 'YYYY-MM-DD'), '16:00', TO_DATE('2023-11-28', 'YYYY-MM-DD'), 15, 15, 500.00);

-- Inserts para assentos válidos
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 1, 1, 'A');
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 1, 1, 'B');
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 1, 1, 'C');
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 1, 1, 'D');
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 2, 2, 'A');
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 2, 2, 'B');
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 2, 2, 'C');
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 2, 2, 'D');
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 3, 3, 'A');
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 3, 3, 'B');
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 3, 3, 'C');
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 3, 3, 'D');
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 4, 4, 'A');
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 4, 4, 'B');
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 4, 4, 'C');
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 4, 4, 'D');
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 5, 5, 'A');
INSERT INTO ASSENTO (id_assento, voo_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 5, 5, 'B');

-- Inserts para passagens válidas
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'João Silva', '123.456.789-01', 1, 1);
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'Maria Santos', '987.654.321-02', 2, 2);
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'Pedro Souza', '456.789.123-03', 3, 3);
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'Ana Rodrigues', '789.123.456-04', 4, 4);
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'Luiz Pereira', '234.567.890-05', 5, 5);
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'Carla Santos', '543.789.012-06', 6, 6);
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'Mário Fernandes', '654.890.123-07', 7, 7);
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'Sandra Lima', '345.901.234-08', 8, 8);
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'Ricardo Santos', '456.012.345-09', 9, 9);
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'Juliana Alves', '567.123.456-10', 10, 10);
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'Gustavo Oliveira', '678.234.567-11', 11, 11);
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'Fernanda Silva', '789.345.678-12', 12, 12);
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'André Ferreira', '890.456.789-13', 13, 13);
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'Isabela Souza', '901.567.890-14', 14, 14);
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'Roberto Santos', '012.678.901-15', 15, 15);

SELECT 
    P.nome AS "Nome",
    P.cpf AS "CPF",
    P.id_passagem AS "ID da Passagem",
    AO.nome AS "Aeroporto de Origem",
    AD.nome AS "Aeroporto de Destino",
    ASSENTO.linha AS "Linha",
    ASSENTO.coluna AS "Coluna",
    AERONAVE.modelo AS "Aeronave",
    VOO.data_origem || ' ' || VOO.hora_origem AS "Data e Hora de Ida",
    VOO.data_chegada || ' ' || VOO.hora_chegada AS "Data e Hora de Volta"
FROM PASSAGEM P
JOIN ASSENTO ON P.assento_id = ASSENTO.id_assento
JOIN VOO ON P.voo_id = VOO.id_voo
JOIN TRECHO T ON VOO.trecho_id = T.id_trecho
JOIN AEROPORTO AO ON VOO.AEROPORTO_ORIGEM = AO.id_aeroporto
JOIN AEROPORTO AD ON VOO.AEROPORTO_CHEGADA = AD.id_aeroporto
JOIN AERONAVE ON VOO.aeronave_id = AERONAVE.id_aeronave;