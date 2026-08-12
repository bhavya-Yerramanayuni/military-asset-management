--
-- PostgreSQL database dump
--

\restrict YAxfsHXzKaIASgaTepo40LXEoAS53VS9PsSn7gl7YsanG8T1Flj4srmzWU57qeV

-- Dumped from database version 17.10 (29ad1b7)
-- Dumped by pg_dump version 17.10

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assets; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.assets (
    id integer NOT NULL,
    base_id integer NOT NULL,
    equipment_type_id integer NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT assets_quantity_check CHECK ((quantity >= 0))
);


ALTER TABLE public.assets OWNER TO neondb_owner;

--
-- Name: assets_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.assets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assets_id_seq OWNER TO neondb_owner;

--
-- Name: assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.assets_id_seq OWNED BY public.assets.id;


--
-- Name: assignments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.assignments (
    id integer NOT NULL,
    base_id integer NOT NULL,
    equipment_type_id integer NOT NULL,
    personnel_name character varying(100) NOT NULL,
    quantity integer NOT NULL,
    assigned_by integer,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT assignments_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.assignments OWNER TO neondb_owner;

--
-- Name: assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assignments_id_seq OWNER TO neondb_owner;

--
-- Name: assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.assignments_id_seq OWNED BY public.assignments.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    user_id integer,
    action character varying(50) NOT NULL,
    details text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.audit_logs OWNER TO neondb_owner;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO neondb_owner;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: bases; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.bases (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    location character varying(150) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.bases OWNER TO neondb_owner;

--
-- Name: bases_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.bases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bases_id_seq OWNER TO neondb_owner;

--
-- Name: bases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.bases_id_seq OWNED BY public.bases.id;


--
-- Name: equipment_types; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.equipment_types (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    category character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT equipment_types_category_check CHECK (((category)::text = ANY ((ARRAY['WEAPON'::character varying, 'VEHICLE'::character varying, 'AMMUNITION'::character varying])::text[])))
);


ALTER TABLE public.equipment_types OWNER TO neondb_owner;

--
-- Name: equipment_types_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.equipment_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equipment_types_id_seq OWNER TO neondb_owner;

--
-- Name: equipment_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.equipment_types_id_seq OWNED BY public.equipment_types.id;


--
-- Name: expenditures; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.expenditures (
    id integer NOT NULL,
    base_id integer NOT NULL,
    equipment_type_id integer NOT NULL,
    quantity integer NOT NULL,
    reason character varying(255),
    recorded_by integer,
    expended_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT expenditures_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.expenditures OWNER TO neondb_owner;

--
-- Name: expenditures_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.expenditures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expenditures_id_seq OWNER TO neondb_owner;

--
-- Name: expenditures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.expenditures_id_seq OWNED BY public.expenditures.id;


--
-- Name: purchases; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.purchases (
    id integer NOT NULL,
    base_id integer NOT NULL,
    equipment_type_id integer NOT NULL,
    quantity integer NOT NULL,
    purchase_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT purchases_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.purchases OWNER TO neondb_owner;

--
-- Name: purchases_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.purchases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchases_id_seq OWNER TO neondb_owner;

--
-- Name: purchases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.purchases_id_seq OWNED BY public.purchases.id;


--
-- Name: transfers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.transfers (
    id integer NOT NULL,
    source_base_id integer NOT NULL,
    destination_base_id integer NOT NULL,
    equipment_type_id integer NOT NULL,
    quantity integer NOT NULL,
    status character varying(20) DEFAULT 'COMPLETED'::character varying,
    initiated_by integer,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT transfers_check CHECK ((source_base_id <> destination_base_id)),
    CONSTRAINT transfers_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT transfers_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'IN_TRANSIT'::character varying, 'COMPLETED'::character varying])::text[])))
);


ALTER TABLE public.transfers OWNER TO neondb_owner;

--
-- Name: transfers_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.transfers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transfers_id_seq OWNER TO neondb_owner;

--
-- Name: transfers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.transfers_id_seq OWNED BY public.transfers.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(30) NOT NULL,
    base_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'BASE_COMMANDER'::character varying, 'LOGISTICS_OFFICER'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: assets id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.assets ALTER COLUMN id SET DEFAULT nextval('public.assets_id_seq'::regclass);


--
-- Name: assignments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.assignments ALTER COLUMN id SET DEFAULT nextval('public.assignments_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: bases id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bases ALTER COLUMN id SET DEFAULT nextval('public.bases_id_seq'::regclass);


--
-- Name: equipment_types id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.equipment_types ALTER COLUMN id SET DEFAULT nextval('public.equipment_types_id_seq'::regclass);


--
-- Name: expenditures id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.expenditures ALTER COLUMN id SET DEFAULT nextval('public.expenditures_id_seq'::regclass);


--
-- Name: purchases id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchases ALTER COLUMN id SET DEFAULT nextval('public.purchases_id_seq'::regclass);


--
-- Name: transfers id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transfers ALTER COLUMN id SET DEFAULT nextval('public.transfers_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.assets (id, base_id, equipment_type_id, quantity, created_at) FROM stdin;
4	1	2	3	2026-08-12 06:01:23.325813
3	2	1	25	2026-08-12 04:34:30.127812
1	1	1	106	2026-08-11 16:35:14.439739
\.


--
-- Data for Name: assignments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.assignments (id, base_id, equipment_type_id, personnel_name, quantity, assigned_by, assigned_at) FROM stdin;
1	1	1	Personnel Alpha	10	1	2026-08-12 05:04:46.102905
2	1	1	Personnel Brav	2	1	2026-08-12 06:14:09.957383
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.audit_logs (id, user_id, action, details, created_at) FROM stdin;
1	1	PURCHASE	Purchased 50 units of equipment type 1 for base 1	2026-08-12 04:22:01.675664
2	1	TRANSFER	Transferred 20 units from base 1 to base 2	2026-08-12 04:34:30.127812
3	1	ASSIGNMENT	Assigned 10 units to Personnel Alpha	2026-08-12 05:04:46.102905
4	1	EXPENDITURE	Expended 5 units. Reason: Training exercise	2026-08-12 05:05:18.51279
5	1	PURCHASE	Purchased 3 units of equipment type 2 for base 1	2026-08-12 06:01:23.325813
6	1	TRANSFER	Transferred 5 units from base 1 to base 2	2026-08-12 06:12:01.586855
7	1	ASSIGNMENT	Assigned 2 units to Personnel Brav	2026-08-12 06:14:09.957383
8	1	EXPENDITURE	Expended 2 units. Reason: Training exercise	2026-08-12 06:15:33.717851
\.


--
-- Data for Name: bases; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.bases (id, name, location, created_at) FROM stdin;
1	Fort Alpha	Karnataka	2026-08-11 16:19:07.300271
2	Fort Bravo	Tamil Nadu	2026-08-11 16:19:07.300271
3	Fort Charlie	Maharashtra	2026-08-11 16:19:07.300271
\.


--
-- Data for Name: equipment_types; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.equipment_types (id, name, category, created_at) FROM stdin;
1	M4 Carbine	WEAPON	2026-08-11 16:19:07.374895
2	AK-47	WEAPON	2026-08-11 16:19:07.374895
3	Humvee	VEHICLE	2026-08-11 16:19:07.374895
4	5.56mm Ammunition	AMMUNITION	2026-08-11 16:19:07.374895
5	7.62mm Ammunition	AMMUNITION	2026-08-11 16:19:07.374895
\.


--
-- Data for Name: expenditures; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.expenditures (id, base_id, equipment_type_id, quantity, reason, recorded_by, expended_at) FROM stdin;
1	1	1	5	Training exercise	1	2026-08-12 05:05:18.51279
2	1	1	2	Training exercise	1	2026-08-12 06:15:33.717851
\.


--
-- Data for Name: purchases; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.purchases (id, base_id, equipment_type_id, quantity, purchase_date, created_by, created_at) FROM stdin;
1	1	1	50	2026-08-12 04:22:01.675664	1	2026-08-12 04:22:01.675664
2	1	2	3	2026-08-12 06:01:23.325813	1	2026-08-12 06:01:23.325813
\.


--
-- Data for Name: transfers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.transfers (id, source_base_id, destination_base_id, equipment_type_id, quantity, status, initiated_by, "timestamp") FROM stdin;
1	1	2	1	20	COMPLETED	1	2026-08-12 04:34:30.127812
2	1	2	1	5	COMPLETED	1	2026-08-12 06:12:01.586855
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, password_hash, role, base_id, created_at) FROM stdin;
1	admin	$2b$10$eBJFQE8hAHJLqPjm026ViOuNq6xvX4EdplgJeA65QL0Ye7V9ExBrG	ADMIN	\N	2026-08-11 16:23:17.179604
2	commander	$2b$10$pdowLW2HNrINnGacODVtW.s3HvkxcZdoP3nlTp2a0dMpKXji7xbzy	BASE_COMMANDER	1	2026-08-11 16:31:04.153121
3	logistics	$2b$10$KMs/Dkj6ImMywBFW2cfNMufP7SKWoHl6kF6mEJpJhwTvi6OkfrLoq	LOGISTICS_OFFICER	\N	2026-08-11 16:32:06.059305
\.


--
-- Name: assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.assets_id_seq', 5, true);


--
-- Name: assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.assignments_id_seq', 2, true);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 8, true);


--
-- Name: bases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.bases_id_seq', 3, true);


--
-- Name: equipment_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.equipment_types_id_seq', 5, true);


--
-- Name: expenditures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.expenditures_id_seq', 2, true);


--
-- Name: purchases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.purchases_id_seq', 2, true);


--
-- Name: transfers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.transfers_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: assets assets_base_id_equipment_type_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_base_id_equipment_type_id_key UNIQUE (base_id, equipment_type_id);


--
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);


--
-- Name: assignments assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: bases bases_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bases
    ADD CONSTRAINT bases_pkey PRIMARY KEY (id);


--
-- Name: equipment_types equipment_types_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.equipment_types
    ADD CONSTRAINT equipment_types_pkey PRIMARY KEY (id);


--
-- Name: expenditures expenditures_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.expenditures
    ADD CONSTRAINT expenditures_pkey PRIMARY KEY (id);


--
-- Name: purchases purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (id);


--
-- Name: transfers transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT transfers_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_assets_base_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_assets_base_id ON public.assets USING btree (base_id);


--
-- Name: idx_assets_equipment_type_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_assets_equipment_type_id ON public.assets USING btree (equipment_type_id);


--
-- Name: idx_audit_logs_created_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at);


--
-- Name: idx_purchases_base_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_purchases_base_id ON public.purchases USING btree (base_id);


--
-- Name: idx_purchases_equipment_type_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_purchases_equipment_type_id ON public.purchases USING btree (equipment_type_id);


--
-- Name: idx_transfers_destination_base_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_transfers_destination_base_id ON public.transfers USING btree (destination_base_id);


--
-- Name: idx_transfers_equipment_type_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_transfers_equipment_type_id ON public.transfers USING btree (equipment_type_id);


--
-- Name: idx_transfers_source_base_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_transfers_source_base_id ON public.transfers USING btree (source_base_id);


--
-- Name: idx_users_base_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_base_id ON public.users USING btree (base_id);


--
-- Name: assets assets_base_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_base_id_fkey FOREIGN KEY (base_id) REFERENCES public.bases(id) ON DELETE CASCADE;


--
-- Name: assets assets_equipment_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_equipment_type_id_fkey FOREIGN KEY (equipment_type_id) REFERENCES public.equipment_types(id) ON DELETE CASCADE;


--
-- Name: assignments assignments_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id);


--
-- Name: assignments assignments_base_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_base_id_fkey FOREIGN KEY (base_id) REFERENCES public.bases(id);


--
-- Name: assignments assignments_equipment_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_equipment_type_id_fkey FOREIGN KEY (equipment_type_id) REFERENCES public.equipment_types(id);


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: expenditures expenditures_base_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.expenditures
    ADD CONSTRAINT expenditures_base_id_fkey FOREIGN KEY (base_id) REFERENCES public.bases(id);


--
-- Name: expenditures expenditures_equipment_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.expenditures
    ADD CONSTRAINT expenditures_equipment_type_id_fkey FOREIGN KEY (equipment_type_id) REFERENCES public.equipment_types(id);


--
-- Name: expenditures expenditures_recorded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.expenditures
    ADD CONSTRAINT expenditures_recorded_by_fkey FOREIGN KEY (recorded_by) REFERENCES public.users(id);


--
-- Name: purchases purchases_base_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_base_id_fkey FOREIGN KEY (base_id) REFERENCES public.bases(id);


--
-- Name: purchases purchases_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: purchases purchases_equipment_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_equipment_type_id_fkey FOREIGN KEY (equipment_type_id) REFERENCES public.equipment_types(id);


--
-- Name: transfers transfers_destination_base_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT transfers_destination_base_id_fkey FOREIGN KEY (destination_base_id) REFERENCES public.bases(id);


--
-- Name: transfers transfers_equipment_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT transfers_equipment_type_id_fkey FOREIGN KEY (equipment_type_id) REFERENCES public.equipment_types(id);


--
-- Name: transfers transfers_initiated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT transfers_initiated_by_fkey FOREIGN KEY (initiated_by) REFERENCES public.users(id);


--
-- Name: transfers transfers_source_base_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT transfers_source_base_id_fkey FOREIGN KEY (source_base_id) REFERENCES public.bases(id);


--
-- Name: users users_base_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_base_id_fkey FOREIGN KEY (base_id) REFERENCES public.bases(id) ON DELETE SET NULL;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict YAxfsHXzKaIASgaTepo40LXEoAS53VS9PsSn7gl7YsanG8T1Flj4srmzWU57qeV

