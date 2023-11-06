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
    coluna number,
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