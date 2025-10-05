import './index.css'
import { useTasks } from './hooks'
import { Header, Alert, TaskForm, TaskList } from './components'

function App() {
  const { 
    tasks, 
    error, 
    successMessage, 
    addTask, 
    completeTask, 
    clearError 
  } = useTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header />

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6">
            <Alert type="success" message={successMessage} />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={clearError} />
          </div>
        )}

        {/* Two Column Layout on Large Screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Task Form */}
          <div>
            <TaskForm onSubmit={addTask} />
          </div>

          {/* Task List */}
          <div>
            <TaskList tasks={tasks} onCompleteTask={completeTask} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;