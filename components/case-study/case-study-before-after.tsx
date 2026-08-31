import type { BlockCaseStudyStat } from "@/lib/case-studies/block-types";

function StatArrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="shrink-0 text-gray-a10"
    >
      <path
        d="M3.333 8h9.334M8.667 5.333L11.333 8l-2.666 2.667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="shrink-0 text-gray-a10"
    >
      <path
        d="M1.333 8c0-3.682 2.985-6.667 6.667-6.667S12.667 4.318 12.667 8 9.682 14.667 6 14.667 1.333 11.682 1.333 8ZM8.667 5.333c0-.368-.299-.667-.667-.667S7.333 4.965 7.333 5.333V8c0 .177.071.346.196.471l1.666 1.667c.262.253.678.249.935-.008.257-.257.261-.673.008-.935L8.667 7.724V5.333Z"
        fill="currentColor"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="shrink-0 text-gray-a10"
    >
      <path
        d="M7.981 8c2.209 0 3.98 1.791 3.98 4v.095c0 .684-.555 1.239-1.239 1.238H5.219c-.684 0-1.239-.555-1.239-1.238V12c-.002-1.212-.415-2.388-1.064-3.333H3.818c-.759.945-1.172 2.121-1.17 3.333v.333c0 .114.008.225.024.334H1.813c-.549 0-1.081-.235-1.453-.636-.36-.43-.481-1.055-.133-1.642.65-1.062 1.802-1.689 3.053-1.698h.505ZM12.694 8.667c1.245-.009 2.397.625 2.953 1.687.348.587.227 1.212-.133 1.642-.372.401-.9.636-1.453.636H11.31a2.65 2.65 0 0 0 .024-.334V12c.002-1.212.415-2.388 1.064-3.333h.505Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CaseStudyBeforeAfter({
  intro,
  before,
  after,
}: {
  intro?: string;
  before: BlockCaseStudyStat;
  after: BlockCaseStudyStat;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-baseline gap-1">
          <span className="text-lg-semibold text-gray-a12">{before.value}</span>
          <span className="text-md-medium text-gray-a11">{before.label}</span>
        </div>
        <StatArrow />
        <div className="flex items-baseline gap-1">
          <span className="text-lg-semibold text-gray-a12">{after.value}</span>
          <span className="text-md-medium text-gray-a11">{after.label}</span>
        </div>
      </div>
      {intro ? (
        <div className="flex items-center gap-1.5">
          <ClockIcon />
          <p className="text-xxs text-gray-a10">{intro}</p>
        </div>
      ) : null}
    </div>
  );
}

export function CaseStudySingleStat({
  stat,
}: {
  stat: BlockCaseStudyStat;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg-semibold text-gray-a12">{stat.value}</p>
      <div className="flex items-center gap-1.5">
        <UsersIcon />
        <p className="text-xxs text-gray-a10">{stat.label}</p>
      </div>
    </div>
  );
}
