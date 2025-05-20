import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import Input from "./input";
import Select from "./select";
import useError from "../hooks/useError";
import Alerts from "./Alerts";
import { getAllUsersRoles } from "../services/userServices";
import { postNewDistributor } from "../services/distributorService";
import NewDistributorText from "../texts/Distributors/oneDistributor/NewDistributorText.json";
import EditDistributorText from "../texts/Distributors/oneDistributor/EditDistributorText.json";

function DistributorForm({
  distributorInfo = {
    id: "",
    name: "",
    email: "",
<<<<<<< HEAD
    roleType: "company",
=======
    roleType: "distributor",
>>>>>>> 75af84f2f32aa9596caf510a245708e3b5f14d56
    isActived: true,
    distributorLogo: "",
    distributorRut: "",
    phoneNumber: "",
    recoveryEmail: "",
    location: "",
  },
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: distributorInfo,
  });
  const [cookies] = useCookies(["token"]);
  const { error, setError } = useError();
  const navigate = useNavigate();

  const [roleDistributor, setRoleDistributor] = useState([]);

  // Obtener el id del rol de company
  useEffect(() => {
    const fetchRoleDistributor = async () => {
      try {
        const rolesData = await getAllUsersRoles(cookies.token);
        // mantenemos solo el tipo company porque ese debe llevarse en un formulario propio
        const filteredRole = rolesData.filter(
          (role) => role.type === "distributor"
        );
        setRoleDistributor(filteredRole);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setError("No se pudieron cargar los roles.");
      }
    };

    fetchRoleDistributor();
  }, [cookies.token, setError]);

  useEffect(() => {
    const role = roleDistributor.length > 0 ? roleDistributor[0] : null;
    if (role) {
      setValue("roleId", role.id);
    }
    setValue("isActived", distributorInfo.isActived);
  }, [setValue, distributorInfo.isActived, roleDistributor]);

  const onSubmit = async (data) => {
    if (cookies.token) {
      try {
        if (!data.encrypted_password) delete data.encrypted_password;
        // añadimos el roleType al objeto data
        const role = roleDistributor.length > 0 ? roleDistributor[0] : null;
        data.roleType = role?.type;
        await postNewDistributor(cookies.token, data, distributorInfo.id);
        navigate(`/admin`);
      } catch (error) {
        console.log(error);
        const message = error.response.data.errors
          ? error.response.data.errors.join(", ")
          : error.message;
        setError(message);
      }
    } else {
      setError("Token expirado, por favor inicie sesión nuevamente.");
    }
  };

  const texts =
    distributorInfo.id === "" ? NewDistributorText : EditDistributorText;

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
                {texts.titles.principalTitle}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {texts.descriptions.principalDescription}
              </p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-y-6">
              <Input
                name="Nombre Distribuidora"
                label="name"
                placeholder="Distribuidora NTH"
                defaultValue={distributorInfo.name}
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
                name="RUT de la Distribuidora"
                label="distributorRut"
                placeholder="12345678-9"
                defaultValue={distributorInfo.distributorRut}
                register={register}
                validation={{
                  required: {
                    value: true,
                    message: "Este campo es obligatorio",
                  },
                  pattern: {
                    value:
                      /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$|^[0-9]{7,8}-[0-9kK]{1}$/,
                    message:
                      "El RUT no es válido, use el formato 12.345.678-9 o 12345678-9",
                  },
                }}
                errors={errors}
              />
              <Input
                name="URL Logo"
                label="distributorLogo"
                defaultValue={distributorInfo.distributorLogo}
                placeholder="https://www.nthconsultores.cl/logo.png"
                register={register}
                validation={{ required: false }}
                errors={errors}
              />
              <Input
                name="Ubicación (Ciudad, Comuna 1234)"
                label="location"
                placeholder="Temuco, Manuel Montt XXXX"
                defaultValue={distributorInfo.location}
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
                name="Número de Teléfono"
                label="phoneNumber"
                placeholder="56978872828"
                defaultValue={distributorInfo.phoneNumber}
                register={register}
                validation={{
                  required: {
                    value: true,
                    message: "Este campo es obligatorio",
                  },
                  pattern: {
                    value: /^[0-9]+$/i,
                    message: "El número de teléfono no es válido",
                  },
                }}
                errors={errors}
              />
              <Select
                name="Estado"
                label="isActived"
                defaultValue={distributorInfo.isActived}
                register={register}
                options={[
                  { value: true, label: "Activo" },
                  {
                    value: false,
                    label: "Inactivo (no podrá ingresar a la aplicación)",
                  },
                ]}
              />
              <Select
                name="Rol"
                label="roleId"
                defaultValue={
                  roleDistributor.length > 0 ? roleDistributor[0].id : ""
                }
                register={register}
                options={[
                  {
                    value:
                      roleDistributor.length > 0 ? roleDistributor[0].id : "",
                    label: "distributor",
                  },
                ]}
                disabled={true}
              />
              <Input
                name="Correo Corporativo"
                label="email"
                defaultValue={distributorInfo.email}
                register={register}
                validation={{
                  required: {
                    value: true,
                    message: "Este campo es obligatorio",
                  },
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "El correo no es válido",
                  },
                }}
                errors={errors}
              />
              <Input
                name="Correo de Recuperación"
                defaultValue={distributorInfo.recoveryEmail}
                label="recoveryEmail"
                register={register}
                validation={{
                  required: {
                    value: true,
                    message: "Este campo es obligatorio",
                  },
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "El correo no es válido",
                  },
                }}
                errors={errors}
              />
              <Input
                name="Contraseña"
                label="encrypted_password"
                placeholder={
                  distributorInfo.name ? texts.placeholders.password : ""
                }
                register={register}
                type="password"
                validation={
                  distributorInfo.name
                    ? {
                        minLength: {
                          value: 8,
                          message:
                            "La contraseña debe tener al menos 8 caracteres",
                        },
                      }
                    : {
                        required: {
                          value: true,
                          message: "Este campo es obligatorio",
                        },
                        minLength: {
                          value: 8,
                          message:
                            "La contraseña debe tener al menos 8 caracteres",
                        },
                      }
                }
                errors={errors}
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                {texts.buttons.submitButton}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DistributorForm;
