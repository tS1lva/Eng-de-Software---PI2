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
    tipo varchar2(20),
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
    data_origem DATE,
    hora_chegada varchar2(255),
    data_chegada DATE,
    id_techo NUMBER,
    valor NUMBER,
    FOREIGN KEY (id_techo) REFERENCES TRECHO (id_trecho)
);
CREATE SEQUENCE SEQ_VOO
START WITH 1 INCREMENT BY 1;

--ASSENTO
CREATE TABLE ASSENTO (
    id_voo NUMBER,
    id_aeronave NUMBER,
    linha number,
    coluna number,
    constraint fk_id_voo_voo FOREIGN KEY (id_voo) REFERENCES VOO (id_voo),
    constraint fk_id_aeronave_aeronave FOREIGN KEY (id_aeronave) REFERENCES AERONAVE (id_aeronave)
);
