export interface MongoIdentifiable {
  _id?: string;
  id?: string;
}

export interface MongoIdentifiableWithTime extends MongoIdentifiable {
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}
