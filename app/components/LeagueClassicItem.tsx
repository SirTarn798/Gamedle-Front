import { LeagueClassicInput } from "@/lib/type";

const getStatusColor = (status: boolean) => {
  return status ? "bg-green-400" : "bg-orange-400";
};

function LeagueClassicItem(props: LeagueClassicInput) {
  return (
    <div className="w-full grid grid-cols-6 items-center gap-4">
      <div className="flex justify-center">
        <div className="w-12 h-12 overflow-hidden rounded">
          <img
            src={props.image}
            alt="Champion"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div
        className={`p-2 text-center rounded ${getStatusColor(props.role.status)}`}
      >
        {props.role.role}
      </div>
      <div
        className={`p-2 text-center rounded ${getStatusColor(props.type.status)}`}
      >
        {props.type.type}
      </div>
      <div
        className={`p-2 text-center rounded ${getStatusColor(props.range.status)}`}
      >
        {props.range.range}
      </div>
      <div
        className={`p-2 text-center rounded ${getStatusColor(props.resource.status)}`}
      >
        {props.resource.resource}
      </div>
      <div
        className={`p-2 text-center rounded ${getStatusColor(props.gender.status)}`}
      >
        {props.gender.gender}
      </div>
    </div>
  );
}

export default LeagueClassicItem;
