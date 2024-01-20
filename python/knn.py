from sklearn.neighbors import KNeighborsClassifier

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


knn = KNeighborsClassifier(
    n_neighbors=50,
    algorithm="brute",
    weights="uniform",
)

X, y = readFileFromPath("data/dataset/training.csv")

knn.fit(X, y)

X, y = readFileFromPath("data/dataset/testing.csv")

accuracy = knn.score(X, y)

print("Accuracy: ", accuracy)
