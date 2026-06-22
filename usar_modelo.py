import joblib

model = joblib.load("modelos/model.pkl")
vectorizer = joblib.load("modelos/vectorizer.pkl")

print("IA Carregada com sucesso!")

while True:
    entrada = input("\nDigite o que o cliente procurou (ou 'sair'): ")

    if entrada.lower() == "sair":
        print("Encerrando testes da IA.")
        break

    entrada_transformada = vectorizer.transform([entrada])
    resultado = model.predict(entrada_transformada)
    # probabilidades = model.predict_proba(entrada_transformada)[0]
    # categorias = model.classes_
    probabilidade = max(model.predict_proba(entrada_transformada)[0]) * 100
    print("Categoria prevista:", resultado[0])
    # print("Confiança por categoria:")         
    print(f"Confiança: {probabilidade:.0f}%")

    # for categoria, prob in zip(categorias, probabilidades):
    #     print(f"- {categoria}: {prob*100:.0f}%")
    
    if resultado[0] == "tecnologia":
        print("Visite nossa seção de tecnologia para encontrar o que procura!")
    elif resultado[0] == "moda":
        print("Visite nossa seção de moda para encontrar o que procura!")
    elif resultado[0] == "presentes":
        print("Visite nossa seção de presentes para encontrar o que procura!")
    elif resultado[0] == "decoracao":
        print("Visite nossa seção de decoração para encontrar o que procura!")
    elif resultado[0] == "livros":
        print("Visite nossa seção de livros para encontrar o que procura!")