import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

vectorizer = TfidfVectorizer()
model = LogisticRegression(max_iter=1000)

df = pd.read_csv("dados.csv")

# print(df)

# print("\nColuna de textos:")
# print(df["texto"])

# print("\nColuna de categorias:")
# print(df["categoria"])

print("Dados carregados com sucesso!")

x = df["texto"]
y = df["categoria"]

x_transformado = vectorizer.fit_transform(x)
model.fit(x_transformado, y)

print("\nModelo treinado com sucesso!")

joblib.dump(vectorizer, "modelos/vectorizer.pkl")
joblib.dump(model, "modelos/model.pkl")

print("\nModelos salvos com sucesso!")