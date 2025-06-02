--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 17.0 (Ubuntu 17.0-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: pok_boss
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO pok_boss;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pok_boss
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO pok_boss;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pok_boss
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: pok_boss
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO pok_boss;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: pok_boss
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO pok_boss;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: pok_boss
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: game; Type: TABLE; Schema: public; Owner: pok_boss
--

CREATE TABLE public.game (
    id character varying(256) NOT NULL,
    group_name character varying(100),
    type character varying DEFAULT 'nlh'::character varying,
    status character varying DEFAULT 'pending'::character varying,
    current_player character varying(12),
    button character varying(12),
    deck character varying(16)[] DEFAULT '{}'::character varying[],
    community_cards character varying(16)[] DEFAULT '{}'::character varying[],
    main_pot uuid,
    last_round_pot integer,
    lock bigint,
    small_blind integer DEFAULT 1,
    big_blind integer DEFAULT 2
);


ALTER TABLE public.game OWNER TO pok_boss;

--
-- Name: participant; Type: TABLE; Schema: public; Owner: pok_boss
--

CREATE TABLE public.participant (
    pot_id uuid NOT NULL,
    user_id character varying(12) NOT NULL
);


ALTER TABLE public.participant OWNER TO pok_boss;

--
-- Name: player; Type: TABLE; Schema: public; Owner: pok_boss
--

CREATE TABLE public.player (
    game_id character varying(256) NOT NULL,
    user_id character varying(12) NOT NULL,
    game_money integer DEFAULT 0,
    current_bet integer,
    status character varying DEFAULT 'pending'::character varying,
    re_buy integer DEFAULT 0,
    session_balance integer DEFAULT 0,
    hole_cards character varying(16)[] DEFAULT '{}'::character varying[],
    next_player character varying(12)
);


ALTER TABLE public.player OWNER TO pok_boss;

--
-- Name: pot; Type: TABLE; Schema: public; Owner: pok_boss
--

CREATE TABLE public.pot (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    game_id character varying(256),
    value integer,
    highest_bet integer
);


ALTER TABLE public.pot OWNER TO pok_boss;

--
-- Name: user; Type: TABLE; Schema: public; Owner: pok_boss
--

CREATE TABLE public."user" (
    id character varying(12) NOT NULL,
    money integer DEFAULT 1000
);


ALTER TABLE public."user" OWNER TO pok_boss;

--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: pok_boss
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: pok_boss
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	a20e86f3139eab68bf4064bbabfdb48224abf35afcc9a1fcf9472f3bfc30670d	1728361066148
2	68c86b2473e1b53e736a8786261b0bc140f08e64c00d96093cad07db67163158	1728495980684
\.


--
-- Data for Name: game; Type: TABLE DATA; Schema: public; Owner: pok_boss
--

COPY public.game (id, group_name, type, status, current_player, button, deck, community_cards, main_pot, last_round_pot, lock, small_blind, big_blind) FROM stdin;
972506536836-1587791362	אמא, אבא, אדם	nlh	pending	\N	\N	{}	{}	\N	\N	\N	1	2
120363385345957316	האם זה הסתדר?	nlh	running	972533403627	972503094188	{{2,10},{3,K},{3,3},{2,6},{4,3},{3,5},{2,Q},{2,4},{1,10},{3,4},{3,7},{2,7},{2,8},{4,4},{1,4},{4,Q},{4,8},{4,A},{3,J},{1,J},{3,2},{4,7},{4,5},{4,9},{2,5},{4,2},{2,J},{1,A},{1,7},{1,Q},{1,6},{1,9},{3,8},{1,K},{1,5},{3,9},{4,6},{2,9},{3,10},{1,3},{2,3},{1,8},{2,2},{4,10},{3,Q},{2,A},{3,A},{4,J}}	{}	d87aa0c5-e2e3-4a81-a4bc-5a751d222afd	0	\N	1	2
120363278412162149	טסטים פוקר	nlh	pending	\N	\N	{}	{}	a1af5af9-9ecb-443d-b476-2b9bf9af1187	0	\N	1	2
120363328660203771	פוקי	nlh	pending	\N	\N	{}	{}	\N	\N	\N	1	2
120363369141087761	פוקרעודד	nlh	pending	\N	\N	{}	{}	ec533b7f-e579-4040-8204-bcf2c117c542	0	\N	1	2
120363405247778300	פוקר חדש ימחק בקרוב	nlh	pending	\N	\N	{{3,6},{2,2},{4,9},{2,3},{2,K},{1,10},{4,5},{3,9},{3,A},{4,Q},{4,A},{1,Q},{1,3},{3,10},{3,J},{2,9},{1,A},{2,Q},{3,K},{1,5},{3,2},{4,10},{2,J},{1,6},{3,3},{3,8},{1,7},{4,2},{3,7},{4,6},{1,9},{4,8},{3,Q},{2,4},{4,7},{2,8},{4,J},{1,J},{2,7},{1,2},{1,K},{1,4},{4,4},{3,5},{1,8},{3,4},{2,6},{2,A},{4,3},{4,K},{2,5},{2,10}}	{}	\N	\N	\N	1	150
120363286951053143	טסטים פוקר 2	nlh	pending	\N	\N	{{2,9},{1,6},{2,8},{2,2},{1,3},{3,9},{4,5},{4,9},{4,A},{1,4},{4,Q},{1,A},{2,Q},{3,A},{4,K},{2,10},{2,3},{1,8},{3,8},{4,2},{3,3},{1,Q},{3,4},{3,10},{3,J},{2,5},{4,10},{3,7},{3,K},{2,7},{1,9},{4,J},{1,K},{4,3},{3,5},{3,6},{2,K},{2,6},{1,7},{2,A},{3,Q},{4,4},{2,J},{3,2},{1,2},{1,5},{4,6},{4,7},{4,8},{1,10},{2,4},{1,J}}	{}	fc7f0378-c6e1-4472-9a55-b057f9909b74	0	\N	1	2
120363371998856689	פוקרליעד	nlh	pending	\N	\N	{}	{}	9afba007-f93d-47a3-bcae-f72e0b5243b2	0	\N	1	2
120363387751202548	פוקמתן	nlh	pending	\N	\N	{}	{}	0334adf4-6c41-4524-812b-eb45122ece7d	0	\N	1	2
120363386373942042	Poker	nlh	pending	\N	\N	{}	{}	a8a65a5a-2eac-41ee-89ef-e2cebd459add	0	\N	1	2
120363357318124606		nlh	pending	\N	\N	{{2,2},{3,4},{2,4},{3,8},{3,9},{3,A},{1,4},{4,4},{2,7},{3,J},{1,K},{4,Q},{4,8},{1,6},{4,5},{4,10},{1,5},{4,A},{1,9},{3,3},{1,J},{4,6},{4,7},{3,K},{1,8},{2,Q},{2,9},{1,10},{2,K},{2,8},{3,10},{4,J},{2,J},{2,3},{2,10},{1,A},{3,2},{2,5},{1,7},{4,9},{4,3},{3,5},{3,Q},{1,3},{2,6},{1,Q},{3,6},{1,2},{4,2},{3,7},{2,A},{4,K}}	{}	86cc54db-b22f-4049-a320-466073156d46	0	\N	1	2
120363391677270631	פוקר עם ממש קצת באגים	nlh	pending	\N	\N	{}	{}	23c8db1b-b657-451c-abeb-f96dc1574cc8	0	\N	2	4
120363044934214926	הגאנג	nlh	pending	\N	\N	{{3,8},{2,10},{4,5},{2,K},{4,10},{2,8},{4,A},{3,7},{4,K},{3,J},{2,4},{4,3},{4,4},{2,A},{4,9},{2,J},{3,9},{4,Q},{2,Q},{4,2},{3,5},{1,7},{3,6},{4,7},{3,4},{1,A},{1,9},{1,8},{3,Q},{3,2},{3,K},{4,J},{3,A},{4,6},{1,4},{2,6},{1,2},{2,3},{2,2},{2,5},{1,5},{1,J},{2,9},{1,3},{4,8},{2,7},{1,10},{1,6},{3,3},{1,K},{3,10},{1,Q}}	{}	\N	\N	\N	1	30
120363357267538324	מחכים בתור	nlh	running	972536288677	972536288677	{{4,10},{4,8},{4,4},{3,J},{2,6},{4,9},{3,K},{4,7},{1,J},{4,J},{2,3},{1,3},{2,8},{3,9},{3,3},{4,A},{2,K},{3,2},{1,6},{2,10},{4,Q},{2,4},{1,8},{1,9},{2,7},{2,5},{3,8},{2,9},{4,5},{3,7},{2,Q},{4,2},{1,7},{1,Q},{1,4},{1,K},{4,3},{1,10},{3,4}}	{{3,A},{3,5},{4,K}}	ddb0a7ea-1ceb-4a2c-af24-eac5fe8ff197	268	\N	1	2
120363372250581508	POKPRODpersonal	nlh	pending	\N	\N	{{3,9},{2,10},{3,8},{4,5},{1,10},{1,8},{2,9},{2,3},{3,4},{2,5},{3,3},{1,4},{4,7},{1,A},{4,6},{2,7},{4,2},{1,7},{4,3},{4,K},{3,J},{1,5},{2,6},{1,6},{3,A},{1,3},{2,A},{4,9},{3,5},{4,8},{2,2},{1,Q},{2,Q},{1,K},{4,10},{1,J},{1,2},{4,A},{3,6},{3,Q},{3,7},{4,4},{2,K},{1,9},{4,J},{3,2},{3,K},{2,J},{2,4},{3,10},{2,8},{4,Q}}	{}	be89d2a0-d3b5-4b42-96d8-e6fc6892f67c	0	\N	1	2
120363388939070401	POKDEVasdf	nlh	pending	\N	\N	{}	{}	\N	\N	\N	1	2
120363405108738539	POKDEVלל	nlh	pending	\N	\N	{}	{}	\N	\N	\N	1	2
120363388899185800	POKDEVhello	nlh	pending	\N	\N	{}	{}	\N	\N	\N	1	2
120363327960327284	טסטים פוקר 3	nlh	pending	\N	\N	{{1,10},{4,2},{2,7},{4,J},{3,9},{1,8},{4,3},{4,4},{3,3},{2,J},{4,A},{3,5},{4,10},{4,Q},{2,Q},{3,A},{4,9},{1,Q},{1,6},{1,2},{4,5},{3,10},{1,4},{2,2},{1,K},{4,6},{1,J},{1,7},{3,2},{1,A},{3,K},{2,A},{4,7},{4,K},{1,3},{1,5},{2,4},{2,3},{2,9},{3,J},{2,K},{2,6},{3,4},{3,7},{3,6},{2,8},{2,10},{4,8},{1,9},{3,8},{3,Q},{2,5}}	{}	527dda59-21ab-420d-a617-4bd4c08314cc	0	\N	1	2
120363372142925585	עד שאדם התעורר	nlh	pending	\N	\N	{{4,A},{2,4},{2,5},{3,A},{3,10},{4,5},{3,2},{3,9},{2,Q},{2,A},{1,3},{1,4},{2,J},{1,9},{4,2},{3,K},{2,3},{1,K},{2,K},{2,10},{3,J},{4,10},{1,A},{2,6},{3,3},{2,2},{4,Q},{4,8},{4,J},{3,6},{2,8},{1,J},{2,9},{2,7},{4,K},{1,10},{1,Q},{1,6},{1,5},{3,7},{1,2},{3,5},{4,6},{4,7},{3,Q},{1,7},{3,8},{4,4},{1,8},{3,4},{4,9},{4,3}}	{}	de13f63b-8d73-4ddf-bc9c-6b668cbe4a9b	0	\N	1	2
120363388351387502		nlh	pending	\N	\N	{}	{}	\N	\N	\N	1	2
120363400303225882	פוקר ג'גר	nlh	running	972528188282	972584428695	{{3,10},{1,A},{3,9},{1,Q},{3,4},{3,J},{4,K},{4,5},{2,4},{4,3},{2,2},{1,4},{1,9},{3,Q},{1,3},{4,8},{2,K},{1,5},{4,Q},{3,2},{2,10},{3,6},{4,J},{1,7},{3,A},{2,Q},{1,J},{1,6},{4,7},{2,3},{3,8},{1,K},{2,6},{4,9},{4,2},{2,J},{2,A},{2,8},{4,A},{2,5},{1,2},{3,3},{4,10},{3,7},{4,4},{2,9},{3,K},{3,5}}	{}	b22fa1ac-414a-45a5-9a78-bc0ceb02cea1	0	1739792380	1	2
120363388837333067		nlh	pending	\N	\N	{}	{}	\N	\N	\N	1	2
120363376489614973	Pok	nlh	pending	\N	\N	{}	{}	6718d9fa-e220-47e6-984d-b4d27883b76a	0	\N	1	2
120363389238301956	שייליפוקר	nlh	pending	\N	\N	{}	{}	4749d570-aae0-4ff0-b221-9c16ea619263	0	\N	1	2
120363368903968966	פוקרבן	nlh	running	972584428695	972536288677	{{1,J},{3,2},{3,9},{2,J},{4,8},{4,J},{3,6},{3,7},{2,K},{4,5},{1,5},{3,J},{3,10},{4,9},{2,A},{1,2},{2,2},{4,6},{2,3},{4,Q},{1,7},{4,3},{3,A},{2,8},{3,Q},{3,K},{2,10},{1,A},{2,9},{4,K},{2,4},{2,7},{1,6},{1,K},{1,3},{1,Q},{4,7},{1,10},{3,8},{1,9},{2,6},{2,5},{4,2},{4,10},{3,3},{1,8},{1,4},{4,4}}	{}	449f8a53-f538-4e50-8129-1a6fb3097ae9	0	\N	1	2
120363404687522165	מחזמר	nlh	pending	\N	\N	{}	{}	b4656824-8495-4128-9f2a-98c29fbc6b62	0	\N	1	2
120363338477148994	פוקר שחר	nlh	running	972543428880	972543428880	{{2,K},{4,10},{3,9},{3,J},{1,9},{4,J},{4,9},{4,3},{3,Q},{3,2},{2,Q},{3,6},{4,A},{1,Q},{4,5},{1,3},{3,3},{2,7},{3,7},{2,2},{1,K},{1,J},{2,9},{3,K},{3,5},{3,8},{2,3},{2,8},{4,7},{4,K},{1,5},{4,4},{3,A},{1,A},{1,4},{4,6},{3,10},{2,A},{4,2},{3,4},{2,5}}	{{1,10},{1,7},{1,6},{1,8},{2,10}}	6678cbb7-8695-4273-a113-8dcd4b4cc16c	84	\N	1	2
972524694035-1385051528	משפוחה	nlh	pending	\N	\N	{}	{}	\N	\N	\N	1	2
120363388032940484	לייקפדמפוק	nlh	running	972536288677	972507771300	{{1,2},{3,4},{3,K},{4,Q},{4,A},{4,10},{1,A},{4,J},{2,5},{3,A},{2,10},{3,J},{2,A},{2,4},{2,3},{4,3},{2,Q},{1,9},{1,4},{4,9},{2,6},{2,8},{2,2},{3,8},{3,Q},{2,K},{3,5},{1,K},{4,K},{4,7},{2,J},{2,9},{3,9},{3,10},{1,7},{1,10},{3,2},{3,7},{1,Q},{3,3},{1,6}}	{{1,8},{2,7},{4,8},{1,J},{4,2}}	581a78b3-d5da-4a35-8a11-06dfc69167d6	18	1736454711	1	2
120363387945467207	חיחךחך	nlh	pending	\N	\N	{}	{}	\N	\N	\N	1	2
120363378103906085	פוקר תחמושתנים	nlh	running	972522226836	972545228949	{{1,2},{2,5},{1,J},{4,9},{4,5},{3,9},{1,K},{4,K},{3,5},{3,10},{2,10},{1,5},{3,6},{4,A},{1,6},{4,2},{2,3},{4,Q},{4,8},{1,8},{3,Q},{2,6},{2,Q},{1,A},{4,7},{2,7},{1,10},{3,8},{2,8},{3,A},{2,J},{4,3},{1,3},{3,2},{4,J},{4,4},{1,9},{3,3},{2,A},{2,9},{3,K},{1,4},{3,J},{2,K},{4,10},{1,Q},{2,4},{3,7}}	{}	59779ed3-cf53-4130-aa83-05a9c1675740	0	\N	1	2
120363401560211195	אשכרה	nlh	pending	\N	\N	{}	{}	98b8d5fd-c3bb-4fd1-b644-13ed412fa9ae	0	\N	1	2
120363334390367107	פוקאחים וגיא	nlh	pending	\N	\N	{}	{}	\N	\N	\N	1	2
120363403550833917	Poker	nlh	running	972506363120	972533403627	{{2,5},{2,Q},{1,9},{2,A},{1,Q},{1,8},{2,3},{3,10},{3,K},{1,6},{4,6},{3,Q},{4,A},{3,4},{3,5},{1,4},{4,K},{2,8},{3,2},{4,2},{4,Q},{4,7},{3,7},{4,4},{3,9},{1,7},{3,A},{1,5},{4,10},{2,10},{4,5},{1,3},{1,10},{2,7},{1,A},{1,2},{3,6},{3,8},{3,3},{2,2},{2,4},{2,6},{4,8},{4,J},{2,J}}	{{2,9},{1,K},{2,K}}	dcdff5dd-b783-495f-8089-682754f1ea4c	4	\N	1	2
120363361685764873	פוקרבן	nlh	pending	\N	\N	{}	{}	d6299e92-8330-4acc-b64b-9d7fcbf5669a	0	\N	1	2
\.


--
-- Data for Name: participant; Type: TABLE DATA; Schema: public; Owner: pok_boss
--

COPY public.participant (pot_id, user_id) FROM stdin;
6ee5f9af-8db9-458d-ac92-ccd1d360a9ca	972584428695
6ee5f9af-8db9-458d-ac92-ccd1d360a9ca	972525220444
6ee5f9af-8db9-458d-ac92-ccd1d360a9ca	972536288677
6ee5f9af-8db9-458d-ac92-ccd1d360a9ca	972544820907
bba97d63-6bb5-4b35-a301-b8966fa81e3b	972525220444
6f180519-a677-485f-b5aa-064e6cefccc8	972536288677
6f180519-a677-485f-b5aa-064e6cefccc8	972525220444
bba97d63-6bb5-4b35-a301-b8966fa81e3b	972544820907
6f180519-a677-485f-b5aa-064e6cefccc8	972544820907
08d982b9-de27-419c-88fa-19409b2e48c0	972536288677
08d982b9-de27-419c-88fa-19409b2e48c0	972584428695
08d982b9-de27-419c-88fa-19409b2e48c0	972507771300
c0a40271-074a-462b-8487-ecbd8d0b50be	972584428695
c0a40271-074a-462b-8487-ecbd8d0b50be	972536288677
c0a40271-074a-462b-8487-ecbd8d0b50be	972507771300
ba89d479-8156-492e-963e-0fea75807488	972503387682
3344bd8f-494b-42fe-bb81-b403b57cb998	972505344118
3344bd8f-494b-42fe-bb81-b403b57cb998	972503387682
6678cbb7-8695-4273-a113-8dcd4b4cc16c	972503387682
6678cbb7-8695-4273-a113-8dcd4b4cc16c	972505344118
9892da8b-f428-4074-bc53-5e8c13238a32	972503387682
9892da8b-f428-4074-bc53-5e8c13238a32	972505344118
e15d2c37-bae1-4dc1-a72a-13d5a11e7d8a	972533403627
e15d2c37-bae1-4dc1-a72a-13d5a11e7d8a	972503094188
f59c0c35-f478-4974-a56f-b219bca0d9d5	972503387682
f59c0c35-f478-4974-a56f-b219bca0d9d5	972505344118
\.


--
-- Data for Name: player; Type: TABLE DATA; Schema: public; Owner: pok_boss
--

COPY public.player (game_id, user_id, game_money, current_bet, status, re_buy, session_balance, hole_cards, next_player) FROM stdin;
120363369141087761	972525324088	0	0	pending	0	0	{}	\N
120363405247778300	972533403627	0	\N	middle join	0	0	{}	\N
120363388032940484	972584428695	252	6	played	0	-100	{{4,5},{4,4}}	972507771300
120363369141087761	972584428695	0	0	pending	0	0	{}	\N
120363388032940484	972536288677	0	6	played	0	-100	{{1,3},{3,6}}	972584428695
120363286951053143	972503627676	0	0	pending	0	0	{}	\N
120363357267538324	972507771300	0	\N	no money	500	-500	{}	972536288677
120363386373942042	972503094188	0	0	pending	0	0	{}	\N
120363368903968966	972584428695	121	2	pending	0	-100	{{3,5},{2,Q}}	972536288677
120363328660203771	972584428695	0	\N	pending	0	0	{}	\N
120363403550833917	972503094188	0	298	played	0	-300	{{4,9},{3,J}}	972506363120
120363328660203771	972503627676	0	\N	pending	0	0	{}	\N
120363357267538324	972536288677	0	77	all in	0	-100	{{4,6},{2,A}}	972507771300
120363401560211195	972545353302	0	0	pending	0	0	{}	\N
120363405247778300	972556630709	100	\N	middle join	0	-100	{}	\N
120363405247778300	972503094188	0	\N	middle join	0	0	{}	\N
120363389238301956	972503387682	0	0	pending	0	0	{}	\N
120363386373942042	972533403627	0	0	pending	0	0	{}	\N
120363286951053143	972528188282	0	\N	pending	0	0	{}	\N
120363403550833917	972506363120	0	0	no money	0	0	{}	972556630709
120363357318124606	972522226836	0	0	pending	0	0	{}	\N
120363403550833917	972556630709	0	\N	just joined	500	-500	{}	972533403627
120363376489614973	972528188282	0	0	pending	0	0	{}	\N
120363372250581508	972584428695	100	\N	pending	0	-100	{}	\N
120363400303225882	972528188282	98	2	pending	0	-100	{{4,6},{1,8}}	972525955404
120363400303225882	972584428695	99	1	pending	0	-100	{{2,7},{1,10}}	972528188282
120363338477148994	972503387682	0	61	all in	0	-100	{{2,J},{4,Q}}	972543428880
120363327960327284	972507771300	0	0	pending	0	0	{}	\N
120363391677270631	972536288677	0	0	pending	0	0	{}	\N
120363044934214926	972533403627	0	\N	middle join	0	0	{}	\N
120363278412162149	972507771300	0	0	pending	0	0	{}	\N
120363338477148994	972543428880	0	\N	middle join	0	0	{}	972503387682
120363400303225882	972525955404	0	0	no money	0	0	{}	972584428695
120363378103906085	972522226836	190	2	pending	0	-100	{{4,6},{1,7}}	972536288677
120363378103906085	972545228949	107	1	pending	0	-100	{{3,4},{2,2}}	972522226836
120363378103906085	972536288677	100	0	no money	0	-200	{{1,A},{1,Q}}	972545228949
120363372142925585	972536288677	100	\N	middle join	0	-100	{}	\N
120363401560211195	972546983880	0	0	pending	0	0	{}	\N
120363385345957316	972503094188	499	1	pending	0	-500	{{4,K},{3,6}}	972533403627
120363385345957316	972533403627	498	2	pending	0	-500	{{2,K},{1,2}}	972503094188
120363404687522165	972529409615	0	0	pending	0	0	{}	\N
120363368903968966	972536288677	68	9	played	0	-100	{{3,4},{4,A}}	972584428695
120363371998856689	972549200285	0	0	pending	0	0	{}	\N
120363388032940484	972507771300	30	6	played	0	-100	{{4,6},{1,5}}	972536288677
120363371998856689	972584428695	100	0	pending	0	-100	{}	\N
120363403550833917	972533403627	0	298	all in	0	-300	{{1,J},{4,3}}	972503094188
\.


--
-- Data for Name: pot; Type: TABLE DATA; Schema: public; Owner: pok_boss
--

COPY public.pot (id, game_id, value, highest_bet) FROM stdin;
fc7f0378-c6e1-4472-9a55-b057f9909b74	120363286951053143	3	2
b22fa1ac-414a-45a5-9a78-bc0ceb02cea1	120363400303225882	3	2
e15d2c37-bae1-4dc1-a72a-13d5a11e7d8a	120363403550833917	600	298
4749d570-aae0-4ff0-b221-9c16ea619263	120363389238301956	3	2
dcdff5dd-b783-495f-8089-682754f1ea4c	120363403550833917	600	298
6ee5f9af-8db9-458d-ac92-ccd1d360a9ca	120363357267538324	108	27
23c8db1b-b657-451c-abeb-f96dc1574cc8	120363391677270631	8	0
86cc54db-b22f-4049-a320-466073156d46	120363357318124606	4	2
bba97d63-6bb5-4b35-a301-b8966fa81e3b	120363357267538324	268	82
6f180519-a677-485f-b5aa-064e6cefccc8	120363357267538324	258	77
ddb0a7ea-1ceb-4a2c-af24-eac5fe8ff197	120363357267538324	268	82
a1af5af9-9ecb-443d-b476-2b9bf9af1187	120363278412162149	6	4
59779ed3-cf53-4130-aa83-05a9c1675740	120363378103906085	3	2
9afba007-f93d-47a3-bcae-f72e0b5243b2	120363371998856689	0	0
be89d2a0-d3b5-4b42-96d8-e6fc6892f67c	120363372250581508	0	0
ec533b7f-e579-4040-8204-bcf2c117c542	120363369141087761	0	0
a8a65a5a-2eac-41ee-89ef-e2cebd459add	120363386373942042	0	0
d6299e92-8330-4acc-b64b-9d7fcbf5669a	120363361685764873	5	2
08d982b9-de27-419c-88fa-19409b2e48c0	120363388032940484	18	6
581a78b3-d5da-4a35-8a11-06dfc69167d6	120363388032940484	18	6
c0a40271-074a-462b-8487-ecbd8d0b50be	120363388032940484	36	6
0334adf4-6c41-4524-812b-eb45122ece7d	120363387751202548	0	0
527dda59-21ab-420d-a617-4bd4c08314cc	120363327960327284	0	0
6718d9fa-e220-47e6-984d-b4d27883b76a	120363376489614973	406	0
449f8a53-f538-4e50-8129-1a6fb3097ae9	120363368903968966	11	9
3344bd8f-494b-42fe-bb81-b403b57cb998	120363338477148994	200	58
9892da8b-f428-4074-bc53-5e8c13238a32	120363338477148994	200	58
ba89d479-8156-492e-963e-0fea75807488	120363338477148994	3	61
6678cbb7-8695-4273-a113-8dcd4b4cc16c	120363338477148994	0	61
d87aa0c5-e2e3-4a81-a4bc-5a751d222afd	120363385345957316	3	2
f59c0c35-f478-4974-a56f-b219bca0d9d5	120363338477148994	200	58
de13f63b-8d73-4ddf-bc9c-6b668cbe4a9b	120363372142925585	0	0
b4656824-8495-4128-9f2a-98c29fbc6b62	120363404687522165	3	2
98b8d5fd-c3bb-4fd1-b644-13ed412fa9ae	120363401560211195	0	0
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: pok_boss
--

COPY public."user" (id, money) FROM stdin;
972549200285	1004
972503627676	999999897
972525220444	900
972544820907	1039
972544396218	799
972556630709	400
972558825235	699
972525324088	1050
972543148382	978
972506625800	1934
972526839019	500
972545228949	900
972529409615	873
972522226836	927
972507771300	1829
972509036050	1096
972503387682	903
972543428880	1000
972505344118	900
972528188282	408
972545353302	1101
972506363120	1000
972525955404	1264
972536288677	1210
972584428695	495
972546983880	749
972533403627	500
972503094188	900
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: pok_boss
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 3, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: pok_boss
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: game game_pkey; Type: CONSTRAINT; Schema: public; Owner: pok_boss
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_pkey PRIMARY KEY (id);


--
-- Name: participant participant_pot_id_user_id_pk; Type: CONSTRAINT; Schema: public; Owner: pok_boss
--

ALTER TABLE ONLY public.participant
    ADD CONSTRAINT participant_pot_id_user_id_pk PRIMARY KEY (pot_id, user_id);


--
-- Name: player player_game_id_user_id_pk; Type: CONSTRAINT; Schema: public; Owner: pok_boss
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_game_id_user_id_pk PRIMARY KEY (game_id, user_id);


--
-- Name: pot pot_pkey; Type: CONSTRAINT; Schema: public; Owner: pok_boss
--

ALTER TABLE ONLY public.pot
    ADD CONSTRAINT pot_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: pok_boss
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: game game_button_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: pok_boss
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_button_user_id_fk FOREIGN KEY (button) REFERENCES public."user"(id);


--
-- Name: game game_current_player_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: pok_boss
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_current_player_user_id_fk FOREIGN KEY (current_player) REFERENCES public."user"(id);


--
-- Name: game game_main_pot_pot_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: pok_boss
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_main_pot_pot_id_fk FOREIGN KEY (main_pot) REFERENCES public.pot(id);


--
-- Name: participant participant_pot_id_pot_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: pok_boss
--

ALTER TABLE ONLY public.participant
    ADD CONSTRAINT participant_pot_id_pot_id_fk FOREIGN KEY (pot_id) REFERENCES public.pot(id);


--
-- Name: participant participant_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: pok_boss
--

ALTER TABLE ONLY public.participant
    ADD CONSTRAINT participant_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: player player_game_id_game_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: pok_boss
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_game_id_game_id_fk FOREIGN KEY (game_id) REFERENCES public.game(id);


--
-- Name: player player_next_player_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: pok_boss
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_next_player_user_id_fk FOREIGN KEY (next_player) REFERENCES public."user"(id);


--
-- Name: player player_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: pok_boss
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: pot pot_game_id_game_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: pok_boss
--

ALTER TABLE ONLY public.pot
    ADD CONSTRAINT pot_game_id_game_id_fk FOREIGN KEY (game_id) REFERENCES public.game(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pok_boss
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

