const Tasks = require("./task.model");

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const createdBy = req.user.id;

    const task = await Tasks.create({
      title,
      description,
      status,
      priority,
      dueDate,
      createdBy,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const user = req.user._id;
    const tasks = await Tasks.find({ createdBy: user });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasksGroupedByStatus = async (req, res) => {
  try {
    const tasks = await Tasks.find({ createdBy: req.params.id });

    const grouped = { TODO: [], IN_PROGRESS: [], DONE: [] };
    for (const task of tasks) {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    }

    res.status(200).json(grouped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.changeStatus = async (req, res) => {
  try {
    const taskId = req.params.id;
    const newStatus = req.body.status;

    if (!taskId || !newStatus) {
      return res.status(400).json({ message: "Task id or status not found" });
    }

    const task = await Tasks.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = newStatus;
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Tasks.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true },
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasksWithPagination = async (req, res) => {
  try {
    const user = req.params.id;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Tasks.find({ createdBy: user })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Tasks.countDocuments({ createdBy: user }),
    ]);

    res.status(200).json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
