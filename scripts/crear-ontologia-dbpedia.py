"""
Crea la ontologia OntologiaPeliculasTerrorDbpedia.owl (RDF/XML)
Estructura: clases y propiedades identicas al OWL original
Datos: poblados desde backend/data/dbpedia-cache.json
"""

import json, os, re
from owlready2 import *
from rdflib import Graph, Namespace, URIRef, Literal
from rdflib.namespace import RDF, RDFS, OWL

NS = "http://www.semanticweb.org/terror/ontologies/2026/PeliculasTerrorDbpedia#"
CACHE_PATH = os.path.join(os.path.dirname(__file__), "..", "backend", "data", "dbpedia-cache.json")
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "OntologiaPeliculasTerrorDbpedia.owl")

P = Namespace(NS)
R = Namespace("http://dbpedia.org/resource/")
XSD = Namespace("http://www.w3.org/2001/XMLSchema#")

g = Graph()
g.bind("", P)
g.bind("owl", OWL)
g.bind("rdfs", RDFS)
g.bind("xsd", XSD)

# Ontologia
g.add((P.Ontology, RDF.type, OWL.Ontology))

# ─── CLASES ───
classes = ["Pelicula", "Persona", "Actor", "Director", "Guionista", "Productora", "Subgenero"]
subclass = {"Actor": "Persona", "Director": "Persona", "Guionista": "Persona"}

for c in classes:
    uri = P[c]
    g.add((uri, RDF.type, OWL.Class))
    if c in subclass:
        g.add((uri, RDFS.subClassOf, P[subclass[c]]))

# ─── OBJECT PROPERTIES ───
obj_props = [
    ("tieneDirector", "Pelicula", "Director"),
    ("tieneActor", "Pelicula", "Actor"),
    ("tieneGuionista", "Pelicula", "Guionista"),
    ("tieneSubgenero", "Pelicula", "Subgenero"),
    ("producidaPor", "Pelicula", "Productora"),
]

for name, dom, rang in obj_props:
    uri = P[name]
    g.add((uri, RDF.type, OWL.ObjectProperty))
    g.add((uri, RDFS.domain, P[dom]))
    g.add((uri, RDFS.range, P[rang]))

# ─── DATA PROPERTIES ───
data_props = [
    ("titulo", "Pelicula", XSD.string),
    ("añoEstreno", "Pelicula", XSD.integer),
    ("duracion", "Pelicula", XSD.integer),
    ("presupuesto", "Pelicula", XSD.integer),
    ("recaudacion", "Pelicula", XSD.integer),
    ("paisOrigen", "Pelicula", XSD.string),
    ("idioma", "Pelicula", XSD.string),
    ("sinopsis", "Pelicula", XSD.string),
    ("imagen", "Pelicula", XSD.string),
    ("urlWikipedia", "Pelicula", XSD.string),
    ("nombre", "Persona", XSD.string),
]

for name, dom, rng in data_props:
    uri = P[name]
    g.add((uri, RDF.type, OWL.DatatypeProperty))
    g.add((uri, RDFS.domain, P[dom]))
    g.add((uri, RDFS.range, rng))

# Guardar estructura vacia
g.serialize(destination=OUTPUT_PATH, format="xml")
print(f"Ontologia vacia creada: {OUTPUT_PATH}")

# ─── POBLAR DESDE CACHE ───
print(f"\nCargando cache: {CACHE_PATH}")
with open(CACHE_PATH, "r", encoding="utf-8") as f:
    cache = json.load(f)
print(f"  {len(cache)} peliculas encontradas\n")

def make_id(name):
    return re.sub(r"[^a-zA-Z0-9_\u00C0-\u024F]", "", name.replace(" ", "_"))

actor_cache = {}
director_cache = {}
guionista_cache = {}
subgenero_cache = {}
productora_cache = {}

for entry in cache:
    local_id = entry.get("localId", "")
    if not local_id:
        continue

    movie_uri = P[local_id]
    g.add((movie_uri, RDF.type, P.Pelicula))

    # Propiedades
    abstract = entry.get("abstract")
    if abstract:
        g.add((movie_uri, P.sinopsis, Literal(abstract, lang="en")))

    budget = entry.get("budget")
    if budget is not None:
        try: g.add((movie_uri, P.presupuesto, Literal(int(round(float(budget))))))
        except: pass

    gross = entry.get("gross")
    if gross is not None:
        try: g.add((movie_uri, P.recaudacion, Literal(int(round(float(gross))))))
        except: pass

    runtime = entry.get("runtime")
    if runtime is not None:
        try: g.add((movie_uri, P.duracion, Literal(int(round(float(runtime))))))
        except: pass

    country = entry.get("country")
    if country:
        g.add((movie_uri, P.paisOrigen, Literal(country)))

    language = entry.get("language")
    if language:
        g.add((movie_uri, P.idioma, Literal(language)))

    thumbnail = entry.get("thumbnail")
    if thumbnail:
        g.add((movie_uri, P.imagen, Literal(thumbnail)))

    wiki = entry.get("wikiPage")
    if wiki:
        g.add((movie_uri, P.urlWikipedia, Literal(wiki)))

    # Directores
    for d_name in entry.get("directors", []):
        if d_name:
            if d_name not in director_cache:
                d_id = make_id(d_name)
                d_uri = P[d_id]
                g.add((d_uri, RDF.type, P.Director))
                g.add((d_uri, P.nombre, Literal(d_name)))
                director_cache[d_name] = d_uri
            g.add((movie_uri, P.tieneDirector, director_cache[d_name]))

    # Actores
    for a_name in entry.get("actors", []):
        if a_name:
            if a_name not in actor_cache:
                a_id = make_id(a_name)
                a_uri = P[a_id]
                g.add((a_uri, RDF.type, P.Actor))
                g.add((a_uri, P.nombre, Literal(a_name)))
                actor_cache[a_name] = a_uri
            g.add((movie_uri, P.tieneActor, actor_cache[a_name]))

    # Guionistas
    for w_name in entry.get("writers", []):
        if w_name:
            if w_name not in guionista_cache:
                w_id = make_id(w_name)
                w_uri = P[w_id]
                g.add((w_uri, RDF.type, P.Guionista))
                g.add((w_uri, P.nombre, Literal(w_name)))
                guionista_cache[w_name] = w_uri
            g.add((movie_uri, P.tieneGuionista, guionista_cache[w_name]))

    # Subgeneros
    for g_name in entry.get("genres", []):
        if g_name:
            clean = make_id(g_name)
            if clean not in subgenero_cache:
                sg_uri = P[clean]
                g.add((sg_uri, RDF.type, P.Subgenero))
                subgenero_cache[clean] = sg_uri
            g.add((movie_uri, P.tieneSubgenero, subgenero_cache[clean]))

    # Productoras
    for c_name in entry.get("productionCompanies", []):
        if c_name:
            if c_name not in productora_cache:
                c_id = make_id(c_name)
                c_uri = P[c_id]
                g.add((c_uri, RDF.type, P.Productora))
                productora_cache[c_name] = c_uri
            g.add((movie_uri, P.producidaPor, productora_cache[c_name]))

g.serialize(destination=OUTPUT_PATH, format="xml")
print(f"\nOntologia poblada guardada: {OUTPUT_PATH}")
print(f"  Peliculas:      {len(cache)}")
print(f"  Actores unicos: {len(actor_cache)}")
print(f"  Directores:     {len(director_cache)}")
print(f"  Guionistas:     {len(guionista_cache)}")
print(f"  Subgeneros:     {len(subgenero_cache)}")
print(f"  Productoras:    {len(productora_cache)}")
