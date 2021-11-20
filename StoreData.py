import pandas as pd
import pymongo 

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["test"]
mycol = mydb["transaction"]

df = pd.read_csv("C:\\Users\\biswatma\\Documents\\test.csv")
transaction_data = []
for idx , row  in df.iterrows():
    transaction_data.append(row.to_dict())
x = mycol.insert_many(transaction_data)

#print list of the _id values of the inserted documents:
print(x.inserted_ids)