import json

from sklearn.neural_network import MLPClassifier

classes = {
    "car": 0,
    "fish": 1,
    "house": 2,
    "tree": 3,
    "bicycle": 4,
    "guitar": 5,
    "pencil": 6,
    "clock": 7,
}


def readFileFromPath(path):
    f = open(path, "r")

    lines = f.readlines()
    # print(len( lines ))

    X = []
    y = []

    for i in range(1, len(lines)):
        # [0.5547945205479452,0.19114219114219114,car]
        line = lines[i].split(",")
        X.append([float(line[j]) for j in range(len(line) - 1)])
        y.append(classes[line[-1].strip()])

    return (X, y)


hidden = 10
mlp = MLPClassifier(
    hidden,
    max_iter=10000,
    random_state=1,
    activation="tanh",
)


X, y = readFileFromPath("../data/dataset/training.csv")


mlp.fit(X, y)


X, y = readFileFromPath("../data/dataset/testing.csv")


accuracy = mlp.score(X, y)
jsonObj = {
    "neuronCounts": [len(X[0]), hidden, len(classes)],
    "classes": list(classes.keys()),
    "network": {
        "levels": [],
    },
}

for i in range(0, len(mlp.coefs_)):
    level = {
        "weights": mlp.coefs_[i].tolist(),
        "biases": mlp.intercepts_[i].tolist(),
        "inputs": [0] * len(mlp.coefs_[i]),
        "outputs": [0] * len(mlp.intercepts_[i]),
    }
    jsonObj["network"]["levels"].append(level)


print("Accuracy: ", accuracy)

json_object = json.dumps(jsonObj, indent=2)


with open("../data/model/model.json", "w") as outfile:
    outfile.write(json_object)

with open("../data/model/model.js", "w") as outfile:
    outfile.write("const model = " + json_object)
