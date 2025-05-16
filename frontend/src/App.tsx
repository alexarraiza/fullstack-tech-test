import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { DataManager } from "./balance-electrico/components/data-manager";
import { RefreshDataButton } from "./balance-electrico/components/refresh-data-button";

function App() {
  return (
    <Layout
      style={{ height: "100dvh", width: "100vw", display: "flex", flex: 1 }}
    >
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            color: "white",

            fontSize: 24,
            fontWeight: "bold",
            marginRight: 16,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          Balance Eléctrico
        </div>
        <div>
          <RefreshDataButton />
        </div>
      </Header>
      <Content style={{ padding: "0 48px", flex: 1, display: "flex" }}>
        <div
          style={{
            display: "flex",
            flex: 1,
            margin: 24,
          }}
        >
          <DataManager />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Alejandro Arraiza - {new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}

export default App;
