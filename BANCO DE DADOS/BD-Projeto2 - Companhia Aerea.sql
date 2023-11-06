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
    data_origem varchar2(20),
    hora_chegada varchar2(255),
    data_chegada varchar2(20),
    AEROPORTO_ORIGEM NUMBER,
    AEROPORTO_CHEGADA NUMBER,
    trecho_id NUMBER,
    valor FLOAT,
    CONSTRAINT fk_aeroportoO_aeroporto FOREIGN KEY (AEROPORTO_ORIGEM) REFERENCES AEROPORTO(id_aeroporto),
    CONSTRAINT fk_aeroportoC_aeroporto FOREIGN KEY (AEROPORTO_CHEGADA) REFERENCES AEROPORTO(id_aeroporto),
    CONSTRAINT fk_idTrecho_trecho FOREIGN KEY (trecho_id) REFERENCES TRECHO(id_trecho)
);
CREATE SEQUENCE SEQ_VOO
START WITH 1 INCREMENT BY 1;

--ASSENTO
CREATE TABLE ASSENTO (
    id_assento number primary key,
    voo_id NUMBER,
    aeronave_id NUMBER,
    linha number,
    coluna char,
    constraint fk_id_voo_voo FOREIGN KEY (voo_id) REFERENCES VOO (id_voo),
    constraint fk_id_aeronave_aeronave FOREIGN KEY (aeronave_id) REFERENCES AERONAVE (id_aeronave)
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
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '08:00', '2023-11-07', '10:00', '2023-11-07', 1, 2, 1, 250.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '09:30', '2023-11-07', '11:30', '2023-11-07', 2, 3, 2, 300.50);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '10:15', '2023-11-08', '12:15', '2023-11-08', 3, 4, 3, 280.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '14:20', '2023-11-08', '16:20', '2023-11-08', 4, 5, 4, 350.75);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '16:45', '2023-11-09', '18:45', '2023-11-09', 5, 6, 5, 400.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '12:30', '2023-11-10', '14:30', '2023-11-10', 6, 7, 6, 275.50);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '09:00', '2023-11-11', '11:00', '2023-11-11', 7, 8, 7, 310.25);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '17:15', '2023-11-11', '19:15', '2023-11-11', 8, 9, 8, 450.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '11:45', '2023-11-12', '13:45', '2023-11-12', 9, 10, 9, 295.75);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '07:30', '2023-11-13', '09:30', '2023-11-13', 10, 1, 10, 320.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '08:00', '2023-11-12', '10:00', '2023-11-12', 6, 7, 11, 300.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '10:30', '2023-11-12', '12:30', '2023-11-12', 7, 8, 12, 350.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '13:00', '2023-11-12', '15:00', '2023-11-12', 8, 9, 13, 400.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '15:30', '2023-11-12', '17:30', '2023-11-12', 9, 10, 14, 450.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '18:00', '2023-11-12', '20:00', '2023-11-12', 10, 1, 15, 500.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '08:00', '2023-11-13', '10:00', '2023-11-13', 1, 2, 16, 300.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '10:30', '2023-11-13', '12:30', '2023-11-13', 2, 3, 17, 350.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '13:00', '2023-11-13', '15:00', '2023-11-13', 3, 4, 18, 400.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '15:30', '2023-11-13', '17:30', '2023-11-13', 4, 5, 19, 450.00);
INSERT INTO VOO (id_voo, hora_origem, data_origem, hora_chegada, data_chegada, AEROPORTO_ORIGEM, AEROPORTO_CHEGADA, trecho_id, valor) VALUES (SEQ_VOO.NEXTVAL, '18:00', '2023-11-13', '20:00', '2023-11-13', 5, 6, 20, 500.00);

-- Inserts para assentos válidos
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 1, 1, 1, 'A');
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 1, 1, 1, 'B');
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 1, 1, 1, 'C');
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 1, 1, 1, 'D');
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 2, 1, 2, 'A');
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 2, 1, 2, 'B');
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 2, 1, 2, 'C');
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 2, 1, 2, 'D');
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 3, 2, 3, 'A');
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 3, 2, 3, 'B');
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 3, 2, 3, 'C');
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 3, 2, 3, 'D');
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 4, 2, 4, 'A');
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 4, 2, 4, 'B');
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 4, 2, 4, 'C');
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 4, 2, 4, 'D');
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 5, 3, 5, 'A');
INSERT INTO ASSENTO (id_assento, voo_id, aeronave_id, linha, coluna) VALUES (SEQ_ASSENTO.NEXTVAL, 5, 3, 5, 'B');

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
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'Camila Pereira', '123.789.012-16', 16, 16);
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'Marcos Alves', '234.890.123-17', 17, 17);
INSERT INTO PASSAGEM (id_passagem, nome, cpf, assento_id, voo_id) VALUES (SEQ_PASSAGEM.NEXTVAL, 'Larissa Lima', '345.901.234-18', 18, 18);

