import React from "react";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import Input from "./input";
import { useParams, useNavigate } from "react-router-dom";
import { postNewWell } from "../services/clientServices";
import { clientFront, wellBack } from "../utils/routes.utils";
import useError from "../hooks/useError";
import Alerts from "./Alerts";
import NewWellText from "../texts/Wells/NewWellText.json";
import EditWellText from "../texts/Wells/EditWellText.json";
import Tooltip from "@mui/material/Tooltip";

const { urlClients } = clientFront;
const { getWells } = wellBack;

function WellForm({ well }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { id: clientId } = useParams();
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const { error, setError } = useError();

  const text = well ? EditWellText : NewWellText;
  const errorText = well
    ? "Error al editar el pozo: "
    : "Error al crear el pozo: ";

  const onSubmit = async (data) => {
    setError(null);
    if (cookies.token) {
      try {
        const code = well ? well.code : null;
        await postNewWell(cookies.token, data, clientId, code);
        const url = `/${urlClients}/${clientId}/${getWells}`;
        navigate(url);
      } catch (error) {
        const message = error.response.data.errors
          ? error.response.data.errors.join(", ")
          : error.message;
        setError(errorText + message);
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {error ? (
        <div className="my-3">
          <Alerts type="error" message={error} />
        </div>
      ) : null}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {text.titles.principalTitle}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {text.descriptions.principalDescription}
              </p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-y-6">
              <Input
                name="Nombre (Palabra que identifique al pozo con facilidad)"
                label="name"
                placeholder="Pozo 1"
                defaultValue={well ? well.name : ""}
                register={register}
                validation={{
                  required: {
                    value: true,
                    message: "Este campo es obligatorio",
                  },
                  maxLength: 70,
                }}
                errors={errors}
              />
              <Input
                name="Ubicación (Ciudad, Comuna 1234)"
                label="location"
                placeholder="Santiago, Arturo Prat 4715"
                register={register}
                defaultValue={well ? well.location : ""}
                validation={{
                  required: {
                    value: true,
                    message: "Este campo es obligatorio",
                  },
                  maxLength: 100,
                }}
                errors={errors}
              />
              <Input
                name="Código de obra"
                label="code"
                placeholder="ABC1638234"
                defaultValue={well ? well.code : ""}
                register={register}
                validation={{
                  required: {
                    value: true,
                    message: "Este campo es obligatorio",
                  },
                  maxLength: 100,
                }}
                errors={errors}
              />
              <Input
                name="Rut de la empresa (Ej: 12345678-9)"
                label="rut"
                placeholder="12345678-9"
                defaultValue={well ? well.rutEmpresa : ""}
                register={register}
                validation={{
                  pattern: {
                    value: /^[1-9]\d*\-(\d|k|K)$/,
                    message: "El RUT debe ir en el formato 12345678-9",
                  },
                }}
                errors={errors}
              />
              <Input
                name="Rut del usuario informate (Ej: 12345678-9)"
                label="informateRut"
                placeholder="12345678-9"
                defaultValue={well ? well.rutInformate : ""}
                register={register}
                validation={{
                  pattern: {
                    value: /^[1-9]\d*\-(\d|k|K)$/,
                    message: "El RUT debe ir en el formato 12345678-9",
                  },
                }}
                errors={errors}
              />
              <Tooltip title="Opciones">
                <Input
                  name="Contraseña del usuario informante"
                  label="password"
                  type="password"
                  placeholder="*********"
                  register={register}
                  errors={errors}
                />
              </Tooltip>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                {text.buttons.submitButton}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WellForm;
