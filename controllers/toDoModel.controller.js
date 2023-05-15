const toDo = require('../models/toDoModel')

//function to get all log in items
exports.getToDoItems = (req, res) => {
    toDo.find()
      .then((toDoItems) => {
        res.json(toDoItems);
      })
  };

// Function to POST a new toDo Item
exports.createItem = (req, res) => {
    // Create a new to do item
  const newItem = new toDo({
    username: req.body.username,
    id: req.body.id,
    title: req.body.title,
    completed: req.body.completed,
  });
  // Save new item to the database
  newItem.save()
    .then((addNewItem) => {
      //200 status to show item successfully added
      res.status(200).json(addNewItem);
    })
    .catch((err) => {
      //400 status in case of error
      res.status(400).send({message: "Error - item could not be added"});
    });
  };

//Function to DELETE an item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await toDo.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    //200 status in case of success
    res.status(200).json({ message: 'Successfully deleted item' });
  } catch (error) {
    console.error(error);
    //500 status in case of server error
    res.status(500).json({ message: 'Server Error' });
  }
};

//function to update an item (POST request)
exports.updateItem = (req, res) => {
  //retrieve item ID
  const id = req.params.id;
  //find by id and update using the id above
  toDo.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedItem) => {
        if (!updatedItem) {
        //404 error in case of failure
        return res.status(404).json({ message: "Error - could not find that Item" });
        }
        //in case of success, 200 status code and update the car
        res.status(200).json(updatedItem);
    })
    .catch((err) => {
    //404 error if car couldnt be updated
    res.status(400).json({ message: "Error - could not update the item" });
    });
};

//function to complete an item (POST request)
exports.completeItem = (req, res) => {
  //retrieve item ID
  const id = req.params.id;
  //find by id and update using the id above
  toDo.findByIdAndUpdate(id, {completed: true}, { new: true })
    .then((updatedItem) => {
        if (!updatedItem) {
        //404 error in case of failure
        return res.status(404).json({ message: "Error - could not find that Item" });
        }
        //in case of success, 200 status code and update the item
        res.status(200).json(updatedItem);
    })
    .catch((err) => {
    //404 error if item couldnt be updated
    res.status(400).json({ message: "Error - could not update the item" });
    });
};
  