import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, isAuthenticated, isTokenExpired, fetchLogsBySeverity, fetchLogsByMethod, fetchAvgResponseTimes, fetchLogsByUser } from "../services/AuthService";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function LogsView() {
  const [logLevels, setLogLevels] = useState({});
  const [methods, setMethods] = useState({});
  const [avgResponseTimes, setAvgResponseTimes] = useState({});
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const severityData = await fetchLogsBySeverity();
        const methodsData = await fetchLogsByMethod();
        const responseTimesData = await fetchAvgResponseTimes();
        const usersData = await fetchLogsByUser();

        setLogLevels(severityData);
        setMethods(methodsData);
        setAvgResponseTimes(responseTimesData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error al obtener los datos de logs:", error);
        setError("No se pudieron cargar los datos de los logs. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const hasDataForServer = (data, server) => {
    if (!data[server]) return false;

    const serverData = data[server];

    if (Array.isArray(serverData)) {
      return serverData.length > 0 && serverData.some(item => item.avgResponseTime > 0);
    }

    if (typeof serverData === "object" && serverData !== null) {
      return Object.keys(serverData).length > 0 && Object.values(serverData).some(value => value > 0);
    }

    if (typeof serverData === "number") {
      return serverData > 0;
    }

    return false;
  };

  const severityLabels = [...new Set(Object.values(logLevels).flatMap(server => Object.keys(server)))];
  const severityChartData = {
    labels: severityLabels,
    datasets: [
      {
        label: "Servidor 1",
        data: severityLabels.map(level => logLevels["Servidor 1"]?.[level] || 0),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      ...(hasDataForServer(logLevels, "Servidor 2")
        ? [
            {
              label: "Servidor 2",
              data: severityLabels.map(level => logLevels["Servidor 2"]?.[level] || 0),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ]
        : []),
    ],
  };

  const methodLabels = [...new Set(Object.values(methods).flatMap(server => Object.keys(server)))];
  const methodsChartData = {
    labels: methodLabels,
    datasets: [
      {
        label: "Servidor 1",
        data: methodLabels.map(method => methods["Servidor 1"]?.[method] || 0),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
      ...(hasDataForServer(methods, "Servidor 2")
        ? [
            {
              label: "Servidor 2",
              data: methodLabels.map(method => methods["Servidor 2"]?.[method] || 0),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ]
        : []),
    ],
  };

  const responseTimeLabels = [...new Set(Object.values(avgResponseTimes).flatMap(server => server.map(item => item.path)))];
  const responseTimesChartData = {
    labels: responseTimeLabels,
    datasets: [
      {
        label: "Servidor 1",
        data: responseTimeLabels.map(path => avgResponseTimes["Servidor 1"]?.find(item => item.path === path)?.avgResponseTime || 0),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      ...(hasDataForServer(avgResponseTimes, "Servidor 2")
        ? [
            {
              label: "Servidor 2",
              data: responseTimeLabels.map(path => avgResponseTimes["Servidor 2"]?.find(item => item.path === path)?.avgResponseTime || 0),
              backgroundColor: "rgba(255, 206, 86, 0.6)",
              borderColor: "rgba(255, 206, 86, 1)",
              borderWidth: 1,
            },
          ]
        : []),
    ],
  };

  const allUserLabels = ["Servidor 1", "Servidor 2"];
  const userLabels = allUserLabels.filter(server => users[server] > 0); // Filtrar servidores con registros
  const userChartData = {
    labels: userLabels,
    datasets: [
      {
        label: "Total de Logs",
        data: userLabels.map(server => users[server] || 0),
        backgroundColor: "rgba(75, 192, 75, 0.6)",
        borderColor: "rgba(75, 192, 75, 1)",
        borderWidth: 1,
      },
    ],
  };

  const navigate = useNavigate();
  const [validSession, setValidSession] = useState(isAuthenticated());

  useEffect(() => {
    const checkSession = () => {
      if (isTokenExpired()) {
        logout();
        setValidSession(false);
        navigate("/login");
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  if (!validSession) return null;

  const handleLogout = () => {
    logout();
    setValidSession(false);
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Gráficas de Logs</h2>

      <div className="mt-4 mb-5">
        <button className="btn btn-danger w-100" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <p>Cargando datos...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      ) : (
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card p-3 shadow-sm">
              <h3 className="text-center mb-3">Niveles de Log</h3>
              <div style={{ height: "300px", width: "100%" }}>
                <Bar
                  data={severityChartData}
                  options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: "Logs por Severidad" } } }}
                />
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card p-3 shadow-sm">
              <h3 className="text-center mb-3">Métodos HTTP</h3>
              <div style={{ height: "300px", width: "100%" }}>
                <Bar
                  data={methodsChartData}
                  options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: "Logs por Método HTTP" } } }}
                />
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card p-3 shadow-sm">
              <h3 className="text-center mb-3">Tiempos de Respuesta Promedio</h3>
              <div style={{ height: "300px", width: "100%" }}>
                <Bar
                  data={responseTimesChartData}
                  options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: "Tiempo de Respuesta Promedio por Ruta" } } }}
                />
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card p-3 shadow-sm">
              <h3 className="text-center mb-3">Logs por Servidor</h3>
              <div style={{ height: "300px", width: "100%" }}>
                <Bar
                  data={userChartData}
                  options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: "Logs por Usuario" } } }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
