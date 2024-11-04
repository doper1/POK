CREATE USER user_1 WITH PASSWORD 'password';
GRANT ALL ON SCHEMA public TO user_1;
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
CREATE SCHEMA drizzle;
ALTER SCHEMA drizzle OWNER TO user_1;
SET default_tablespace = '';
SET default_table_access_method = heap;
CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);
ALTER TABLE drizzle.__drizzle_migrations OWNER TO user_1;
CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO user_1;
ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;
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
    lock bigint
);
ALTER TABLE public.game OWNER TO user_1;
CREATE TABLE public.participant (
    pot_id uuid NOT NULL,
    user_id character varying(12) NOT NULL
);
ALTER TABLE public.participant OWNER TO user_1;
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
ALTER TABLE public.player OWNER TO user_1;
CREATE TABLE public.pot (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    game_id character varying(256),
    value integer,
    highest_bet integer
);
ALTER TABLE public.pot OWNER TO user_1;
CREATE TABLE public."user" (
    id character varying(12) NOT NULL,
    money integer DEFAULT 1000
);
ALTER TABLE public."user" OWNER TO user_1;
ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);
COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
6	savour	1011672077809
4	Pace	8016043640324
\.
COPY public.game (id, group_name, type, status, current_player, button, deck, community_cards, main_pot, last_round_pot, lock) FROM stdin;
because	and duh refine	nlh	pending	\N	\N	{}	{}	\N	\N	\N
483817220198664770	outside	nlh	to end	967634788163	735389693558	{{3,10},{3,8},{4,6},{4,7},{3,2},{1,5},{2,3},{2,6},{2,J},{4,2},{1,3},{4,4},{3,3},{2,9},{3,9},{3,5},{3,Q},{2,Q},{1,A},{4,3},{4,Q},{2,K},{1,7},{2,2},{3,6},{2,A},{1,Q},{4,K},{2,4},{1,6},{3,J},{4,A},{4,10},{1,2},{1,4},{4,5},{2,8},{4,J},{3,7},{3,4},{2,7},{1,K},{1,8},{3,K},{4,8},{2,5},{3,A},{2,10},{1,9},{1,J},{4,9},{1,10}}	{}	29e20199-be5a-4b20-adde-e7ac21927121	7	\N
730628827398016400	accidentally	nlh	running	300829246461	252821822895	{{4,9},{2,6},{4,2},{2,10},{4,10},{4,4},{2,Q},{2,9},{3,7},{1,K},{4,8},{4,K},{4,6},{2,A},{4,A},{3,5},{1,7},{4,5},{1,4},{4,J},{1,10},{2,K},{3,4},{2,7},{4,Q},{1,3},{2,2},{1,2},{3,6},{1,A},{3,J},{3,K},{3,Q},{3,3},{2,8},{2,3},{3,2},{2,5},{1,8},{1,J},{1,6},{1,9},{4,7},{3,A},{2,J},{4,3},{2,4}}	{{1,Q},{1,5},{3,10},{3,8},{3,9}}	21e013a0-f71e-4153-a64e-578d57e14a2a	76	\N
517286478668545340	as although while aw	nlh	pending	\N	\N	{}	{}	b0303fd2-b24a-4e57-b895-90f24471231f	7	\N
670576926195342800	other	nlh	running	735389693558	967634788163	{{2,Q},{4,4},{4,Q},{2,10},{1,9},{2,2},{4,K},{3,Q},{1,2},{1,Q},{3,K},{4,3},{3,5},{3,J},{3,3},{2,4},{3,A},{2,3},{4,8},{4,7},{2,9},{4,A},{1,J},{1,5},{1,7},{4,5},{1,K},{2,6},{3,7},{1,8},{4,9},{1,3},{3,2},{2,K},{2,5},{2,J},{3,4},{4,10},{2,A},{3,8},{4,2},{4,J},{1,A},{1,4},{3,9},{4,6},{2,8},{1,10}}	{{2,7},{3,6},{3,10},{1,6}}	23c885ac-8133-4a48-b283-06a6c6c10799	2	\N
646113435532609000	awkwardly	nlh	pending	\N	\N	{}	{}	b3764f7d-5c20-4d91-8d7c-0c9b9937d215	7	2211196164
293544077846006600	informal	nlh	running	735389693558	735389693558	{{3,3},{1,J},{4,Q},{3,A},{3,9},{2,6},{3,K},{1,3},{2,5},{1,Q},{2,2},{1,10},{4,K},{1,7},{2,9},{4,9},{1,4},{1,K},{3,8},{4,2},{4,J},{3,10},{3,5},{3,Q},{2,K},{4,A},{2,J},{2,3},{3,2},{3,7},{2,Q},{4,8},{1,9},{2,7},{3,6},{4,4},{2,A},{2,10},{2,8},{1,8},{3,4},{1,6},{1,2},{4,7},{1,A},{4,6},{4,10},{4,5},{3,J},{2,4},{1,5},{4,3}}	{}	9c17ce13-00b5-46b5-a0c0-7de8142670c4	7	1483570202
\.
COPY public.participant (pot_id, user_id) FROM stdin;
\.
COPY public.player (game_id, user_id, game_money, current_bet, status, re_buy, session_balance, hole_cards, next_player) FROM stdin;
670576926195342800	967634788163	31	7	folded	7	120	{{2,8},{1,10}}	735389693558
670576926195342800	735389693558	54	7	pending	7	120	{{3,9},{4,6}}	252821822895
670576926195342800	252821822895	66	7	pending	7	120	{{1,A},{1,4}}	967634788163
646113435532609000	567673970758	7	7	pending	7	7	{}	\N
483817220198664770	576395579910	7	7	no money	7	120	{{3,6},{4,7}}	252821822895
because	489376006203	28	\N	pending	7	120	{}	\N
517286478668545340	252821822895	7	7	pending	7	7	{}	\N
517286478668545340	404836814730	7	7	pending	7	7	{}	\N
730628827398016400	300829246461	649	7	pending	7	64174	{{4,3},{2,4}}	252821822895
730628827398016400	252821822895	72	7	pending	7	120	{{3,A},{2,J}}	300829246461
483817220198664770	447297497074	7	7	no money	7	120	{{4,K},{1,3}}	967634788163
293544077846006600	735389693558	28	7	folded	7	120	{{1,A},{4,6}}	967634788163
483817220198664770	252821822895	16	6	pending	7	120	{{4,9},{1,10}}	447297497074
483817220198664770	735389693558	849	7	pending	7	120	{{1,9},{1,J}}	576395579910
293544077846006600	967634788163	34	6	folded	7	120	{{1,5},{4,3}}	735389693558
483817220198664770	967634788163	35	4	pending	7	120	{{3,A},{2,10}}	735389693558
293544077846006600	447297497074	7	\N	pending	28	120	{}	\N
646113435532609000	252821822895	261	\N	pending	7	7425	{}	\N
293544077846006600	576395579910	7	\N	pending	28	120	{}	\N
\.
COPY public.pot (id, game_id, value, highest_bet) FROM stdin;
b3764f7d-5c20-4d91-8d7c-0c9b9937d215	646113435532609000	9	4
9c17ce13-00b5-46b5-a0c0-7de8142670c4	293544077846006600	9	4
23c885ac-8133-4a48-b283-06a6c6c10799	670576926195342800	2	7
29e20199-be5a-4b20-adde-e7ac21927121	483817220198664770	9	4
b0303fd2-b24a-4e57-b895-90f24471231f	517286478668545340	7	7
21e013a0-f71e-4153-a64e-578d57e14a2a	730628827398016400	76	7
\.
COPY public."user" (id, money) FROM stdin;
972505344118	0
972503627676	541
972506536836	950
972528578237	1000
972528188282	950
972584392003	859
972584223240	900
972548057444	850
972542450560	750
972584428695	710
\.
SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 2, true);
ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.participant
    ADD CONSTRAINT participant_pot_id_user_id_pk PRIMARY KEY (pot_id, user_id);
ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_game_id_user_id_pk PRIMARY KEY (game_id, user_id);
ALTER TABLE ONLY public.pot
    ADD CONSTRAINT pot_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_button_user_id_fk FOREIGN KEY (button) REFERENCES public."user"(id);
ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_current_player_user_id_fk FOREIGN KEY (current_player) REFERENCES public."user"(id);
ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_main_pot_pot_id_fk FOREIGN KEY (main_pot) REFERENCES public.pot(id);
ALTER TABLE ONLY public.participant
    ADD CONSTRAINT participant_pot_id_pot_id_fk FOREIGN KEY (pot_id) REFERENCES public.pot(id);
ALTER TABLE ONLY public.participant
    ADD CONSTRAINT participant_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id);
ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_game_id_game_id_fk FOREIGN KEY (game_id) REFERENCES public.game(id);
ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_next_player_user_id_fk FOREIGN KEY (next_player) REFERENCES public."user"(id);
ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id);
ALTER TABLE ONLY public.pot
    ADD CONSTRAINT pot_game_id_game_id_fk FOREIGN KEY (game_id) REFERENCES public.game(id);
